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
              KOLEKSI MUSIM BARU
            </p>

            <h1 className="text-5xl font-light leading-[1.15] tracking-wide md:text-7xl">
              Sederhana,
              <br />
              <span className="font-serif italic">tetap istimewa.</span>
            </h1>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/85">
              Temukan esensial timelessness yang dirancang untuk membuat setiap
              hari terasa stylish tanpa susah.
            </p>

            <a
              href="#collection"
              className="mt-9 inline-block border border-white px-9 py-4 text-[10px] tracking-[3px] transition hover:bg-white hover:text-black"
            >
              Jelajahi Koleksi
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
        <p className="mb-5 text-[10px] tracking-[4px] text-[#a18d72]">
          SELAMAT DATANG DI VELORA
        </p>

        <h2 className="font-serif text-3xl font-light leading-relaxed md:text-5xl">
          Gaya sehari-hari,
          <br />
          <span className="italic">tanpa repot.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#77746d]">
          Kami percaya bahwa busana sebaiknya sederhana, nyaman, dan tak lekang
          oleh waktu. Temukan berbagai busana yang mencerminkan gaya pribadi
          Anda.
        </p>
      </section>

      {/* Categories */}
      <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-5 md:grid-cols-2 md:px-10">
        <a
          href={`/${countryCode}/categories/wanita`}
          className="group relative h-[430px] overflow-hidden bg-[#e8e0d5] md:h-[580px]"
        >
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=85"
            alt="Women's fashion collection"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute bottom-10 left-9 text-white">
            <p className="text-[10px] tracking-[4px]">TEMUKAN GAYAMU</p>
            <h3 className="mt-3 font-serif text-4xl">Wanita</h3>
            <p className="mt-5 text-xs tracking-[3px] underline underline-offset-8">
              KOLEKSI WANITA
            </p>
          </div>
        </a>

        <a
          href={`/${countryCode}/categories/pria`}
          className="group relative h-[430px] overflow-hidden bg-[#d8d4cc] md:h-[580px]"
        >
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&q=85"
            alt="Men's fashion collection"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute bottom-10 left-9 text-white">
            <p className="text-[10px] tracking-[4px]">TEMUKAN GAYAMU</p>
            <h3 className="mt-3 font-serif text-4xl">Pria</h3>
            <p className="mt-5 text-xs tracking-[3px] underline underline-offset-8">
              KOLEKSI PRIA
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
              DIKURASI UNTUKMU
            </p>
          </div>

          <a
            href={`/${countryCode}/store`}
            className="hidden text-[10px] tracking-[2px] underline underline-offset-8 sm:block"
          >
            LIHAT SEMUA
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
          FILOSOFI KAMI
        </p>

        <h2 className="mx-auto mt-6 max-w-3xl font-serif text-3xl font-light leading-relaxed md:text-5xl">
          Tren datang dan pergi,
          <br />
          <span className="italic">Your style, your story.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#77746d]">
          Untuk kamu yang percaya kalau tampil keren nggak harus berlebihan.
          Simpel, berkualitas, dan tetap jadi diri sendiri.
        </p>
      </section>

      {/* Newsletter */}
      <section className="px-5 py-20 text-center">
        <h2 className="font-serif text-3xl">Stay in the loop.</h2>
        <p className="mt-4 text-xs text-[#77746d]">
          Dapatkan informasi terkini mengenai koleksi baru dan rilisan
          eksklusif.
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
