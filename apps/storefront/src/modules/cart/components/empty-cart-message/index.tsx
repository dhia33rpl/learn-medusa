import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center px-2 py-32 text-center text-[#24231f] md:py-48"
      data-testid="empty-cart-message"
    >
      <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
        TAS BELANJA
      </p>

      <h1 className="font-serif text-3xl font-light md:text-4xl">
        Tas belanjamu masih kosong
      </h1>

      <p className="mx-auto mb-8 mt-4 max-w-[32rem] text-sm leading-7 text-[#77746d]">
        Belum ada produk di tas belanjamu. Yuk, mulai jelajahi koleksi kami dan
        temukan yang kamu suka.
      </p>

      <LocalizedClientLink
        href="/store"
        data-testid="empty-cart-explore-button"
        className="inline-block border border-[#292821] bg-[#292821] px-8 py-4 text-[10px] uppercase tracking-[3px] text-white transition hover:bg-transparent hover:text-[#292821]"
      >
        Jelajahi Koleksi
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
