import { Metadata } from "next"

import { STORE_NAME } from "@lib/util/site"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: `Cara menghubungi layanan pelanggan ${STORE_NAME}.`,
}

// GANTI data kontak di bawah dengan data asli tokomu.
const CONTACTS = [
  {
    label: "WhatsApp",
    value: "+62 812 0000 0000",
    href: "https://wa.me/628120000000",
    note: "Cara tercepat untuk bertanya soal pesanan.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path
          d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5Z"
          strokeLinejoin="round"
        />
        <path
          d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.3-1.3-1.8-1-.7.6c-.7-.3-1.6-1.2-1.9-1.9l.6-.7-1-1.8L9 9.5Z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "halo@velora.com",
    href: "mailto:halo@velora.com",
    note: "Kami membalas dalam 1 x 24 jam kerja.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Jam Layanan",
    value: "Senin - Sabtu",
    href: undefined,
    note: "09.00 - 17.00 WIB. Di luar jam itu, pesanmu kami balas di hari kerja berikutnya.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const FAQS = [
  {
    q: "Bagaimana cara membayar dengan transfer bank?",
    a: "Pilih Transfer Bank saat checkout, lalu pilih bank tujuan. Setelah pesanan dibuat, kamu akan melihat nomor rekening dan total yang harus dibayar. Cantumkan nomor pesanan pada catatan transfer.",
  },
  {
    q: "Di mana mengunggah bukti transfer?",
    a: "Di halaman konfirmasi pesanan, ada bagian Bukti Transfer. Unggah foto bukti pembayaran (JPG, PNG, atau WEBP). Kamu juga bisa melakukannya nanti dari halaman akun, di menu pesanan.",
  },
  {
    q: "Berapa lama pembayaran dikonfirmasi?",
    a: "Setelah bukti diunggah, tim kami memverifikasinya di jam layanan. Status pesananmu akan berubah begitu pembayaran kami konfirmasi.",
  },
  {
    q: "Bagaimana cara kerja COD?",
    a: "Pilih COD (Bayar di Tempat) saat checkout. Siapkan uang tunai sesuai total pesanan dan bayar langsung kepada kurir saat pesanan tiba.",
  },
]

export default function ContactPage() {
  return (
    <div className="bg-[#faf9f6] text-[#24231f]">
      {/* Hero */}
      <section className="border-b border-[#e9e6df] bg-white">
        <div className="mx-auto max-w-[900px] px-5 py-16 text-center md:px-10 md:py-24">
          <p className="mb-4 text-[10px] tracking-[5px] text-[#a18d72]">
            LAYANAN PELANGGAN
          </p>
          <h1 className="font-serif text-4xl font-light md:text-6xl">
            Ada yang bisa kami bantu?
          </h1>
          <div className="mx-auto my-7 h-px w-16 bg-[#a18d72]" />
          <p className="mx-auto max-w-[34rem] text-sm leading-7 text-[#77746d]">
            Pertanyaan soal pesanan, pembayaran, pengiriman, atau pengembalian
            barang? Tim {STORE_NAME} siap membantu. Sertakan nomor pesananmu
            agar kami bisa menjawab lebih cepat.
          </p>
        </div>
      </section>

      {/* Kartu kontak */}
      <section className="mx-auto max-w-[1100px] px-5 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CONTACTS.map((item) => (
            <div
              key={item.label}
              className="group flex flex-col gap-y-3 border border-[#e9e6df] bg-white p-7 transition hover:border-[#292821]"
            >
              <span className="text-[#a18d72]">{item.icon}</span>

              <p className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                {item.label}
              </p>

              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="break-words font-serif text-2xl font-light transition group-hover:text-[#a18d72]"
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-serif text-2xl font-light">{item.value}</p>
              )}

              <p className="text-xs leading-6 text-[#77746d]">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pertanyaan umum */}
      <section className="mx-auto max-w-[760px] px-5 pb-14 md:px-10 md:pb-20">
        <div className="mb-8 text-center">
          <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
            PERTANYAAN UMUM
          </p>
          <h2 className="font-serif text-3xl font-light md:text-4xl">
            Mungkin jawabannya ada di sini
          </h2>
        </div>

        <div className="border-t border-[#e9e6df]">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group border-b border-[#e9e6df] py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="text-xl font-light text-[#a18d72] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-[#77746d]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Ajakan */}
      <section className="bg-[#292821] text-white">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-y-5 px-5 py-14 text-center md:px-10 md:py-16">
          <p className="text-[10px] uppercase tracking-[4px] text-[#a18d72]">
            Sudah punya pesanan?
          </p>
          <h2 className="font-serif text-3xl font-light md:text-4xl">
            Cek status dan unggah bukti transfer
          </h2>
          <p className="max-w-[30rem] text-sm leading-7 text-white/65">
            Semua pesananmu ada di halaman akun, lengkap dengan status
            pembayaran dan pengiriman.
          </p>
          <LocalizedClientLink
            href="/account/orders"
            className="mt-2 inline-block border border-white px-8 py-4 text-[10px] uppercase tracking-[3px] text-white transition hover:bg-white hover:text-[#292821]"
          >
            Lihat Pesananku
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
