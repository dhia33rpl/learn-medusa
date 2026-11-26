import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Layanan Pelanggan",
}

export default function CustomerServicePage() {
  return (
    <div className="bg-[#faf9f6] text-[#24231f]">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-10">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
            BANTUAN DAN DUKUNGAN
          </p>
          <h1 className="font-serif text-3xl font-light md:text-5xl">
            Layanan Pelanggan
          </h1>
        </div>

        <div className="flex flex-col gap-y-6 border border-[#e9e6df] bg-white p-6 text-sm leading-7 text-[#77746d] md:p-10">
          <p>
            Butuh bantuan? Tim layanan pelanggan kami siap membantu Anda dengan
            pertanyaan, masalah, atau permintaan terkait produk dan layanan
            kami.
          </p>

          <div className="flex flex-col gap-y-1">
            <span className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
              WhatsApp
            </span>
            <span className="text-[#24231f]">+62 812 0000 0000</span>
          </div>

          <div className="flex flex-col gap-y-1">
            <span className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
              Email
            </span>
            <span className="text-[#24231f]">halo@velora.com</span>
          </div>

          <div className="flex flex-col gap-y-1">
            <span className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
              Jam Layanan
            </span>
            <span className="text-[#24231f]">
              Senin - Sabtu, 09.00 - 17.00 WIB
            </span>
          </div>

          <LocalizedClientLink
            href="/contact"
            className="w-fit border border-[#292821] bg-[#292821] px-8 py-4 text-[10px] uppercase tracking-[3px] text-white transition hover:bg-transparent hover:text-[#292821]"
          >
            Hubungi Kami
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
