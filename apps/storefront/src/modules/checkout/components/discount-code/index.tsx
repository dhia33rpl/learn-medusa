"use client"

import React from "react"
import { useFormStatus } from "react-dom"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const ApplyButton = () => {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-[#292821] bg-[#292821] px-5 text-[10px] uppercase tracking-[3px] text-white transition hover:bg-transparent hover:text-[#292821] disabled:cursor-not-allowed disabled:opacity-50"
      data-testid="discount-apply-button"
    >
      {pending ? "..." : "Apply"}
    </button>
  )
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : String(e))
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="flex w-full flex-col">
      <div className="text-sm">
        <form action={(a) => addPromotionCode(a)} className="mb-5 w-full">
          <div className="my-2 flex items-center gap-x-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-[10px] uppercase tracking-[3px] text-[#a18d72] underline underline-offset-4 transition hover:text-[#24231f]"
              data-testid="add-discount-button"
            >
              Add Promotion Code(s)
            </button>
          </div>

          {isOpen && (
            <>
              <div className="flex w-full gap-x-2">
                <input
                  className="h-11 w-full border border-[#d8d4cc] bg-transparent px-4 text-sm text-[#24231f] outline-none transition placeholder:text-[#77746d] focus:border-[#292821]"
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  placeholder="Enter code"
                  data-testid="discount-input"
                />
                <ApplyButton />
              </div>

              <ErrorMessage
                error={errorMessage}
                data-testid="discount-error-message"
              />
            </>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col">
              <p className="mb-2 text-[10px] uppercase tracking-[3px] text-[#77746d]">
                Promotion(s) applied
              </p>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="mb-2 flex w-full max-w-full items-center justify-between"
                    data-testid="discount-row"
                  >
                    <div className="flex w-4/5 items-baseline gap-x-2 pr-1 text-xs">
                      <span className="truncate" data-testid="discount-code">
                        <span
                          className={
                            promotion.is_automatic
                              ? "bg-[#a18d72] px-2 py-1 text-[10px] uppercase tracking-[2px] text-white"
                              : "bg-[#292821] px-2 py-1 text-[10px] uppercase tracking-[2px] text-white"
                          }
                        >
                          {promotion.code}
                        </span>{" "}
                        <span className="text-[#77746d]">
                          (
                          {promotion.application_method?.value !== undefined &&
                            promotion.application_method.currency_code !==
                              undefined && (
                              <>
                                {promotion.application_method.type ===
                                "percentage"
                                  ? `${promotion.application_method.value}%`
                                  : convertToLocale({
                                      amount:
                                        +promotion.application_method.value,
                                      currency_code:
                                        promotion.application_method
                                          .currency_code,
                                    })}
                              </>
                            )}
                          )
                        </span>
                      </span>
                    </div>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center text-[#77746d] transition hover:text-[#24231f]"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          Remove discount code from order
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
