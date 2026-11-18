"use client"

import { useState } from "react"
import { useConfigure } from "react-instantsearch"

import { priceAttribute } from "@lib/search-client"

const PriceRange = ({ currencyCode }: { currencyCode: string }) => {
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  const attr = priceAttribute("min_price", currencyCode)

  const conditions: string[] = []
  if (min !== "") conditions.push(`${attr} >= ${Number(min)}`)
  if (max !== "") conditions.push(`${attr} <= ${Number(max)}`)

  useConfigure({
    filters: conditions.length ? conditions.join(" AND ") : undefined,
  })

  return (
    <div className="flex flex-col gap-y-3" data-testid="price-range">
      <span className="txt-compact-small-plus text-ui-fg-muted">Price</span>
      <div className="flex items-center gap-x-2">
        <input
          type="number"
          min={0}
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-full border border-ui-border-base rounded-md px-2 py-1 text-sm"
        />
        <span>-</span>
        <input
          type="number"
          min={0}
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-full border border-ui-border-base rounded-md px-2 py-1 text-sm"
        />
      </div>
    </div>
  )
}

export default PriceRange
