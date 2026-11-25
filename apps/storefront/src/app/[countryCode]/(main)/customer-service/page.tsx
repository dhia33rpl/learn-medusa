import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Layanan Pelanggan",
}

export default function CustomerServicePage() {
  return (
    <div className="bg-[#faf9f6] text-[#24231f]">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-10">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
           Bantuan & Dukungan
          </p>
          <h1 className="font-serif text-3xl font-light md:text-5xl">
            Layanan Pelanggan 
          </h1>
        </div>

        <div className="flex flex-col gap-y-6 border border-[#e9e6df] bg-white p-6 text-sm leading-7 text-[#77746d] md:p-10">
          <p>
            Butuh bantuan? Tim layanan pelanggan kami siap membantu Anda dengan pertanyaan, masalah, atau permintaan terkait produk dan layanan kami. 
          </p>
          <div className="flex flex-col gap-y-1">
            <span className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
              WhatsApp
            </span>
            <span className="text-[#24231f]">+62 800 0000 0000</span>
          </div>
          <div className="flex flex-col gap-y-1">
            <span className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
              Email
            </span>
            <span className="text-[#24231f]">help@example.com</span>
          </div>
          <div className="flex flex-col gap-y-1">
            <span className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
              Telepon
            </span>
            <span className="text-[#24231f]">Every day, 09.00–17.00 WIB</span>
          </div>
        </div>
      </div>
    </div>
  )
}
