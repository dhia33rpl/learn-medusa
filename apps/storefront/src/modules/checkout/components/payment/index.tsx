"use client"

import { Radio as RadioOption, RadioGroup } from "@headlessui/react"
import { isManual, isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession, setPaymentChoice } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripePaymentContainer,
} from "@modules/checkout/components/payment-container"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type PaymentChoice = "transfer" | "cod"
type BankChoice = "bca" | "bri" | "bni" | "mandiri"

const BANKS: { id: BankChoice; title: string }[] = [
  { id: "bca", title: "BCA" },
  { id: "bri", title: "BRI" },
  { id: "bni", title: "BNI" },
  { id: "mandiri", title: "Mandiri" },
]

const CHOICES: {
  id: PaymentChoice
  title: string
  desc: string
}[] = [
  {
    id: "transfer",
    title: "Transfer Bank",
    desc: "Pilih bank tujuan untuk melakukan pembayaran.",
  },
  {
    id: "cod",
    title: "COD (Bayar di Tempat)",
    desc: "Bayar tunai ke kurir saat pesanan tiba.",
  },
]

const toChoice = (value: unknown): PaymentChoice =>
  value === "cod" ? "cod" : "transfer"

const getInfo = (providerId?: string) =>
  providerId ? (paymentInfoMap as Record<string, any>)[providerId] : undefined

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const [choice, setChoice] = useState<PaymentChoice>(
    toChoice(cart.metadata?.payment_choice)
  )

  const [selectedBank, setSelectedBank] = useState<BankChoice>(
    (cart.metadata?.payment_bank as BankChoice) || "bca"
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const manualMethod = availablePaymentMethods?.find((m) => isManual(m.id))

  const otherMethods =
    availablePaymentMethods?.filter((m) => !isManual(m.id)) ?? []

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  // Simpan pilihan pembayaran (dan bank, khusus transfer) ke metadata cart.
  const handleChoice = async (value: PaymentChoice) => {
    if (!manualMethod) return

    setError(null)
    setChoice(value)
    setIsLoading(true)

    try {
      await setPaymentChoice(
        value,
        value === "transfer" ? selectedBank : undefined
      )
      await setPaymentMethod(manualMethod.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards &&
    ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])
      ?.length > 0 &&
    cart?.total === 0
  )

  const paymentReady =
    (activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) ||
    paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (isManual(selectedPaymentMethod)) {
        // Simpan lagi pilihan terakhir (termasuk bank) sebelum masuk review.
        await setPaymentChoice(
          choice,
          choice === "transfer" ? selectedBank : undefined
        )
      }

      const shouldInputPaymentDetails =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputPaymentDetails) {
        router.push(pathname + "?" + createQueryString("step", "review"), {
          scroll: false,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const isSubmitDisabled =
    (isStripeLike(selectedPaymentMethod) && !paymentComplete) ||
    (!selectedPaymentMethod && !paidByGiftcard) ||
    isLoading

  const savedChoiceTitle = CHOICES.find(
    (c) => c.id === cart.metadata?.payment_choice
  )?.title

  const summaryTitle =
    activeSession && isManual(activeSession.provider_id) && savedChoiceTitle
      ? savedChoiceTitle
      : getInfo(activeSession?.provider_id)?.title || activeSession?.provider_id

  const selectedBankTitle = BANKS.find(
    (bank) => bank.id === selectedBank
  )?.title

  return (
    <div className="border-b border-[#e9e6df] pb-8">
      <div className="mb-6 flex flex-row items-center justify-between">
        <h2
          className={clx(
            "flex flex-row items-center gap-x-2 font-serif text-2xl font-light md:text-3xl",
            {
              "pointer-events-none select-none opacity-50":
                !isOpen && !paymentReady,
            }
          )}
        >
          Pembayaran
          {!isOpen && paymentReady && (
            <CheckCircleSolid className="text-[#a18d72]" />
          )}
        </h2>

        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-[10px] uppercase tracking-[3px] text-[#a18d72] underline underline-offset-4 transition hover:text-[#24231f]"
            data-testid="edit-payment-button"
          >
            Ubah
          </button>
        )}
      </div>

      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && !!availablePaymentMethods?.length && (
            <>
              {manualMethod && (
                <RadioGroup
                  value={isManual(selectedPaymentMethod) ? choice : ""}
                  onChange={(value: string) =>
                    handleChoice(value as PaymentChoice)
                  }
                >
                  {CHOICES.map((option) => {
                    const selected =
                      isManual(selectedPaymentMethod) && choice === option.id

                    return (
                      <RadioOption
                        key={option.id}
                        value={option.id}
                        data-testid={`payment-choice-${option.id}`}
                        className={clx(
                          "mb-2 flex cursor-pointer flex-col gap-y-1 border px-6 py-4 text-sm transition",
                          {
                            "border-[#292821] bg-white": selected,
                            "border-[#d8d4cc] hover:border-[#292821]":
                              !selected,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <span
                            className={clx(
                              "flex h-4 w-4 items-center justify-center rounded-full border",
                              selected ? "border-[#292821]" : "border-[#d8d4cc]"
                            )}
                          >
                            {selected && (
                              <span className="h-2 w-2 rounded-full bg-[#292821]" />
                            )}
                          </span>

                          <span className="text-[#24231f]">{option.title}</span>
                        </div>

                        {selected && (
                          <>
                            <p className="pl-8 text-xs leading-6 text-[#77746d]">
                              {option.desc}
                            </p>

                            {option.id === "transfer" && (
                              <div className="pl-8 pt-3">
                                <label
                                  htmlFor="payment-bank"
                                  className="mb-2 block text-xs text-[#77746d]"
                                >
                                  Pilih bank tujuan
                                </label>

                                <select
                                  id="payment-bank"
                                  value={selectedBank}
                                  onChange={(e) =>
                                    setSelectedBank(
                                      e.target.value as BankChoice
                                    )
                                  }
                                  className="w-full border border-[#d8d4cc] bg-white px-4 py-3 text-sm text-[#24231f] outline-none focus:border-[#292821] small:max-w-xs"
                                >
                                  {BANKS.map((bank) => (
                                    <option key={bank.id} value={bank.id}>
                                      {bank.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </>
                        )}
                      </RadioOption>
                    )
                  })}
                </RadioGroup>
              )}

              {otherMethods.length > 0 && (
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setPaymentMethod(value)}
                >
                  {otherMethods.map((paymentMethod) => (
                    <div key={paymentMethod.id}>
                      {isStripeLike(paymentMethod.id) ? (
                        <StripePaymentContainer
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                          setError={setError}
                          setPaymentComplete={setPaymentComplete}
                        />
                      ) : (
                        <PaymentContainer
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              )}
            </>
          )}

          {paidByGiftcard && (
            <div className="flex w-full flex-col gap-y-1 small:w-1/3">
              <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                Metode pembayaran
              </p>
              <p
                className="text-sm leading-6 text-[#77746d]"
                data-testid="payment-method-summary"
              >
                Kartu hadiah
              </p>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="mt-6 w-full border border-[#292821] bg-[#292821] px-6 py-4 text-[10px] uppercase tracking-[3px] text-white transition hover:bg-transparent hover:text-[#292821] disabled:cursor-not-allowed disabled:opacity-50 small:w-auto"
            data-testid="submit-payment-button"
          >
            {isLoading
              ? "Menyimpan..."
              : !activeSession && isStripeLike(selectedPaymentMethod)
              ? "Masukkan detail pembayaran"
              : "Lanjut ke Tinjauan"}
          </button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex w-full flex-col gap-y-6 small:flex-row small:items-start small:gap-x-6">
              <div className="flex w-full flex-col gap-y-1 small:w-1/3">
                <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                  Metode pembayaran
                </p>
                <p
                  className="text-sm leading-6 text-[#77746d]"
                  data-testid="payment-method-summary"
                >
                  {summaryTitle}
                </p>
              </div>

              <div className="flex w-full flex-col gap-y-1 small:w-1/3">
                <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                  Detail pembayaran
                </p>
                <div
                  className="flex items-center gap-2 text-sm text-[#77746d]"
                  data-testid="payment-details-summary"
                >
                  <div className="flex h-7 w-fit items-center border border-[#e9e6df] p-2">
                    {getInfo(selectedPaymentMethod)?.icon || <CreditCard />}
                  </div>
                  <span>
                    {choice === "transfer"
                      ? `Transfer Bank - ${selectedBankTitle}`
                      : "Bayar di tempat (COD)"}
                  </span>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex w-full flex-col gap-y-1 small:w-1/3">
              <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                Metode pembayaran
              </p>
              <p
                className="text-sm leading-6 text-[#77746d]"
                data-testid="payment-method-summary"
              >
                Kartu hadiah
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Payment
