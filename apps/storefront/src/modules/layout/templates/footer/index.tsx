import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="bg-[#292821] px-6 py-14 text-white md:px-12">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-2xl tracking-[5px]">VELORA</h2>
          <p className="mt-4 max-w-xs text-xs leading-6 text-white/55">
            Everyday style, effortlessly yours. Timeless fashion for everyone.
          </p>
        </div>

        <div>
          <h3 className="text-[10px] tracking-[3px]">EXPLORE</h3>
          <div className="mt-5 flex flex-col gap-3 text-xs text-white/65">
            <LocalizedClientLink
              href="/categories/women"
              className="transition hover:text-white"
            >
              Women
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/men"
              className="transition hover:text-white"
            >
              Men
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="transition hover:text-white"
            >
              New Arrivals
            </LocalizedClientLink>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] tracking-[3px]">ACCOUNT</h3>
          <div className="mt-5 flex flex-col gap-3 text-xs text-white/65">
            <LocalizedClientLink
              href="/account"
              className="transition hover:text-white"
            >
              My Account
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/cart"
              className="transition hover:text-white"
            >
              Shopping Bag
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-[1400px] border-t border-white/15 pt-6 text-center text-[10px] tracking-widest text-white/45">
        © 2026 VELORA. ALL RIGHTS RESERVED.
      </div>
    </footer>
  )
}
