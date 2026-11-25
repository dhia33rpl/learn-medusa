"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

type SortValue = "created_at" | "price_asc" | "price_desc"

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "created_at", label: "Produk Terbaru" },
  { value: "price_asc", label: "Harga: Rendah -> Tinggi" },
  { value: "price_desc", label: "Harga: Tinggi -> Rendah" },
]

export default function StoreSort({ sortBy }: { sortBy: SortValue }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: SortValue) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div
      className="mb-8 flex flex-col gap-3 small:mb-0 small:mr-12 small:min-w-[200px]"
      data-testid="sort-by-container"
    >
      <p className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
        Urutkan Berdasarkan
      </p>

      <ul className="flex flex-row flex-wrap gap-x-5 gap-y-2 small:flex-col small:gap-y-3">
        {SORT_OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => handleChange(option.value)}
              className={`text-sm transition hover:text-[#a18d72] ${
                sortBy === option.value
                  ? "font-medium text-[#24231f]"
                  : "text-[#77746d]"
              }`}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}