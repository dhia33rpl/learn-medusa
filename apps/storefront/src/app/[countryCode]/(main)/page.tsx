import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: { limit: 8 },
  })

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#24231f]">
      {/* Announcement */}
      <div className="bg-[#292821] px-4 py-2.5 text-center text-[10px] tracking-[2px] text-white sm:text-xs">
        FREE SHIPPING FOR ORDERS OVER €50
      </div>

      {/* Hero */}
      <section
        id="home"
        className="relative mx-auto max-w-[1500px] px-4 pt-5 md:px-8"
      >
        <div
          className="relative flex min-h-[510px] items-center overflow-hidden bg-cover bg-center md:min-h-[650px]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(25,23,20,0.48), rgba(25,23,20,0.02)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=90')",
          }}
        >
          <div className="relative z-10 max-w-xl px-7 py-16 text-white md:px-20">
            <p className="mb-6 text-[10px] tracking-[5px] md:text-xs">
              THE NEW SEASON COLLECTION
            </p>

            <h1 className="text-5xl font-light leading-[1.15] tracking-wide md:text-7xl">
              Less is
              <br />
              more.
              <br />
              <span className="font-serif italic">Always.</span>
            </h1>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/85">
              Discover timeless essentials designed to make every day feel
              effortlessly stylish.
            </p>

            <a
              href="#collection"
              className="mt-9 inline-block border border-white px-9 py-4 text-[10px] tracking-[3px] transition hover:bg-white hover:text-black"
            >
              EXPLORE COLLECTION
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
        <p className="mb-5 text-[10px] tracking-[4px] text-[#a18d72]">
          WELCOME TO VELORA
        </p>

        <h2 className="font-serif text-3xl font-light leading-relaxed md:text-5xl">
          Everyday style,
          <br />
          <span className="italic">effortlessly yours.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#77746d]">
          We believe fashion should be simple, comfortable, and timeless. Find
          pieces that reflect your own style.
        </p>
      </section>

      {/* Categories */}
      <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-5 md:grid-cols-2 md:px-10">
        <a
          href={`/${countryCode}/categories/women`}
          className="group relative h-[430px] overflow-hidden bg-[#e8e0d5] md:h-[580px]"
        >
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=85"
            alt="Women's fashion collection"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute bottom-10 left-9 text-white">
            <p className="text-[10px] tracking-[4px]">DISCOVER YOUR STYLE</p>
            <h3 className="mt-3 font-serif text-4xl">Women</h3>
            <p className="mt-5 text-xs tracking-[3px] underline underline-offset-8">
              SHOP WOMEN
            </p>
          </div>
        </a>

        <a
          href={`/${countryCode}/categories/men`}
          className="group relative h-[430px] overflow-hidden bg-[#d8d4cc] md:h-[580px]"
        >
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&q=85"
            alt="Men's fashion collection"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute bottom-10 left-9 text-white">
            <p className="text-[10px] tracking-[4px]">EFFORTLESS EVERYDAY</p>
            <h3 className="mt-3 font-serif text-4xl">Men</h3>
            <p className="mt-5 text-xs tracking-[3px] underline underline-offset-8">
              SHOP MEN
            </p>
          </div>
        </a>
      </section>

      {/* Products (dari Medusa) */}
      <section
        id="collection"
        className="mx-auto max-w-[1400px] px-5 py-24 md:px-10"
      >
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
              CURATED FOR YOU
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">New Arrivals</h2>
          </div>

          <a
            href={`/${countryCode}/store`}
            className="hidden text-[10px] tracking-[2px] underline underline-offset-8 sm:block"
          >
            VIEW ALL
          </a>
        </div>

        {products.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#77746d]">
            Belum ada produk yang tampil. Pastikan produk sudah Published dan
            variant-nya punya harga untuk region ini.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-x-6">
            {products.map((product: HttpTypes.StoreProduct) => {
              const { cheapestPrice } = getProductPrice({ product })
              const image = product.thumbnail ?? product.images?.[0]?.url
              const tag = product.tags?.[0]?.value

              return (
                <a
                  key={product.id}
                  href={`/${countryCode}/products/${product.handle}`}
                  className="group block"
                >
                  <article>
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#eeeae3]">
                      {image && (
                        <img
                          src={image}
                          alt={product.title ?? "Product"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      )}

                      {tag && (
                        <span className="absolute left-3 top-3 bg-[#faf9f6] px-3 py-2 text-[8px] uppercase tracking-[2px]">
                          {tag}
                        </span>
                      )}
                    </div>

                    <div className="pt-4">
                      {product.subtitle && (
                        <p className="text-[9px] uppercase tracking-[2px] text-[#a18d72]">
                          {product.subtitle}
                        </p>
                      )}
                      <h3 className="mt-2 text-xs font-medium md:text-sm">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#77746d]">
                        {cheapestPrice?.calculated_price ?? ""}
                      </p>
                    </div>
                  </article>
                </a>
              )
            })}
          </div>
        )}
      </section>

      {/* Brand Story */}
      <section className="bg-[#eae5dc] px-6 py-20 text-center md:py-28">
        <p className="text-[10px] tracking-[4px] text-[#8d7d68]">
          OUR PHILOSOPHY
        </p>

        <h2 className="mx-auto mt-6 max-w-3xl font-serif text-3xl font-light leading-relaxed md:text-5xl">
          Fashion fades.
          <br />
          <span className="italic">Style remains.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#77746d]">
          VELORA is created for those who appreciate simplicity, quality, and
          the beauty of everyday moments.
        </p>
      </section>

      {/* Newsletter */}
      <section className="px-5 py-20 text-center">
        <h2 className="font-serif text-3xl">Stay in the loop.</h2>
        <p className="mt-4 text-xs text-[#77746d]">
          Get updates on new collections and exclusive releases.
        </p>
        <a
          href="#home"
          className="mt-7 inline-block border-b border-[#292821] pb-2 text-[10px] tracking-[3px]"
        >
          DISCOVER VELORA
        </a>
      </section>
    </main>
  )
}
