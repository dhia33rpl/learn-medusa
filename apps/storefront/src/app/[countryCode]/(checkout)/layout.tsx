import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full bg-[#faf9f6] text-[#24231f] small:min-h-screen">
      <div className="h-[76px] border-b border-[#e9e6df] bg-[#faf9f6]">
        <nav className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-5 md:px-10">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-[11px] uppercase tracking-[2px] text-[#77746d] transition hover:text-[#24231f]"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">Kembali ke keranjang </span>
            <span className="mt-px block small:hidden">Kembali</span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/"
            className="text-2xl font-semibold tracking-[5px]"
            data-testid="store-link"
          >
            VELORA
          </LocalizedClientLink>

          <div className="flex-1 basis-0" />
        </nav>
      </div>

      <div className="relative" data-testid="checkout-container">
        {children}
      </div>

      <div className="flex w-full items-center justify-center py-6 text-[10px] uppercase tracking-widest text-[#77746d]">
        © 2026 VELORA. Hak cipta dilindungi.
      </div>
    </div>
  )
}