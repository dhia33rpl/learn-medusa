import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Koleksi",
  description: "Jelajahi seluruh koleksi produk kami.",
}

const VALID_SORTS: SortOptions[] = ["created_at", "price_asc", "price_desc"]

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string; sortBy?: string }>
}) {
  const { countryCode } = await props.params
  const { page, sortBy } = await props.searchParams

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const pageNumber = page ? Math.max(parseInt(page, 10) || 1, 1) : 1

  const sort: SortOptions = VALID_SORTS.includes(sortBy as SortOptions)
    ? (sortBy as SortOptions)
    : "created_at"

  return (
    <StoreTemplate countryCode={countryCode} page={pageNumber} sortBy={sort} />
  )
}