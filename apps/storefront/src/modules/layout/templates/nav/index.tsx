import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative border-b border-[#e9e6df] bg-[#faf9f6]/95 backdrop-blur-md">
        <nav className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 text-[#24231f] md:px-10">
          {/* Kiri: menu + link kategori */}
          <div className="flex flex-1 basis-0 items-center gap-7">
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>

            <div className="hidden items-center gap-7 text-[11px] tracking-[2px] md:flex">
              <LocalizedClientLink
                href="/categories/women"
                className="transition hover:text-[#a18d72]"
              >
                WOMEN
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/categories/men"
                className="transition hover:text-[#a18d72]"
              >
                MEN
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/store"
                className="transition hover:text-[#a18d72]"
              >
                COLLECTION
              </LocalizedClientLink>
            </div>
          </div>

          {/* Tengah: logo */}
          <div className="flex items-center">
            <LocalizedClientLink
              href="/"
              className="text-2xl font-semibold tracking-[5px]"
              data-testid="nav-store-link"
            >
              VELORA
            </LocalizedClientLink>
          </div>

          {/* Kanan: search, account, cart */}
          <div className="flex flex-1 basis-0 items-center justify-end gap-x-6 text-xs tracking-widest">
            <Search />
            <LocalizedClientLink
              className="hidden transition hover:text-[#a18d72] small:block"
              href="/account"
              data-testid="nav-account-link"
            >
              ACCOUNT
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 transition hover:text-[#a18d72]"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  BAG (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
