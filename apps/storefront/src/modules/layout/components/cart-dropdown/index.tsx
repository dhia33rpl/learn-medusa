"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { retrieveCart } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

type CartDropdownProps = {
  cart: HttpTypes.StoreCart | null
}

const CartDropdown = ({ cart: initialCart }: CartDropdownProps) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(initialCart)
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | null>(null)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const currentPathname = usePathname()
  const requestId = useRef(0)

  // Ambil data keranjang terbaru dari server.
  // - Jawaban lama yang datang terlambat diabaikan.
  // - Kalau hasilnya kosong, coba sekali lagi setelah 800 ms
  //   (kadang keranjang belum selesai tersimpan).
  const refreshCart = (retry = true) => {
    const id = ++requestId.current

    retrieveCart()
      .then((c) => {
        if (id !== requestId.current) return

        if (c) {
          setCart(c)
          return
        }

        if (retry) {
          setTimeout(() => refreshCart(false), 800)
          return
        }

        setCart(null)
      })
      .catch(() => {})
  }

  // Ambil saat pertama tampil dan setiap pindah halaman
  useEffect(() => {
    refreshCart()
    setCartDropdownOpen(false)
  }, [currentPathname])

  // Ambil lagi saat tab browser kembali aktif
  useEffect(() => {
    const onFocus = () => refreshCart()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  const open = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    refreshCart() // segarkan juga saat kursor diarahkan ke Tas
    setCartDropdownOpen(true)
  }

  const delayedClose = () => {
    const timer = setTimeout(() => {
      setCartDropdownOpen(false)
    }, 200)

    setActiveTimer(timer)
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const totalItems =
    cart?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cart?.subtotal ?? 0

  const formatAmount = (amount: number) =>
    convertToLocale({
      amount,
      currency_code: cart?.currency_code ?? "idr",
    })

  return (
    <div
      className="z-50 h-full"
      onMouseEnter={open}
      onMouseLeave={delayedClose}
    >
      <Popover className="relative flex h-full">
        <LocalizedClientLink
          href="/cart"
          className="flex h-full items-center text-[11px] uppercase tracking-[2px] transition-all duration-200 ease-out hover:text-[#a18d72] focus:outline-none"
          data-testid="nav-cart-link"
        >
          Tas ({totalItems})
        </LocalizedClientLink>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="absolute right-0 top-[calc(100%+1px)] z-[60] hidden w-[420px] border border-white/10 bg-[#292821] p-6 text-white shadow-2xl sm:block"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h3 className="text-xs font-medium uppercase tracking-[3px] text-white/80">
                Tas Belanja
              </h3>
              <span className="text-xs text-white/50">
                {totalItems} Barang
              </span>
            </div>

            {cart && cart.items?.length ? (
              <div className="flex max-h-[360px] flex-col gap-y-4 overflow-y-auto py-4 pr-1">
                {[...cart.items]
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    const image =
                      item.thumbnail ?? item.variant?.product?.thumbnail
                    const handle =
                      item.product_handle ?? item.variant?.product?.handle

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-x-4 border-b border-white/10 py-2 last:border-none"
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${handle}`}
                          className="relative block h-20 w-16 flex-shrink-0 overflow-hidden bg-[#3a392f]"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={item.title ?? "Produk"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[8px] tracking-[2px] text-[#a18d72]">
                              VELORA
                            </div>
                          )}
                        </LocalizedClientLink>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex flex-col">
                            <span
                              className="mb-1 text-xs uppercase tracking-wider text-white/60"
                              data-testid="cart-item-product-type"
                            >
                              {item.variant?.product?.collection?.title || ""}
                            </span>
                            <LocalizedClientLink
                              href={`/products/${handle}`}
                              className="line-clamp-1 text-sm font-medium transition hover:text-[#a18d72]"
                              data-testid="cart-item-title"
                            >
                              {item.title}
                            </LocalizedClientLink>
                            <span
                              className="mt-0.5 text-xs text-white/50"
                              data-testid="cart-item-variant"
                            >
                              {item.variant?.title}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span
                              className="text-xs text-white/70"
                              data-testid="cart-item-quantity"
                            >
                              Jml: {item.quantity}
                            </span>
                            <span
                              className="text-xs font-semibold tracking-wide text-white"
                              data-testid="cart-item-unit-price"
                            >
                              {formatAmount(
                                item.unit_price ??
                                  (item.subtotal ?? 0) / item.quantity
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="self-center">
                          <DeleteButton
                            id={item.id}
                            data-testid="cart-item-remove-button"
                          >
                            <span className="cursor-pointer text-xs text-white/40 transition hover:text-red-400">
                              Hapus
                            </span>
                          </DeleteButton>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="mb-4 text-sm tracking-wide text-white/50">
                  Tas belanjamu masih kosong.
                </p>
                <LocalizedClientLink
                  href="/store"
                  className="border border-white/30 px-6 py-2.5 text-[11px] uppercase tracking-[2px] transition hover:border-white hover:bg-white hover:text-black"
                >
                  Jelajahi Koleksi
                </LocalizedClientLink>
              </div>
            )}

            {cart && cart.items?.length ? (
              <div className="flex flex-col gap-y-4 border-t border-white/15 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/60">
                    Subtotal
                  </span>
                  <span
                    className="text-sm font-semibold tracking-wider text-white"
                    data-testid="cart-subtotal"
                  >
                    {formatAmount(subtotal)}
                  </span>
                </div>
                <LocalizedClientLink
                  href="/cart"
                  className="w-full bg-white py-3 text-center text-[11px] font-medium uppercase tracking-[2px] text-black transition hover:bg-[#a18d72] hover:text-white"
                  data-testid="go-to-cart-button"
                >
                  Lihat Tas
                </LocalizedClientLink>
              </div>
            ) : null}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown