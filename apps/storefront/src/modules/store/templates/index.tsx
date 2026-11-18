"use client"

import type { SearchClient } from "instantsearch.js"
import { Configure, InstantSearch } from "react-instantsearch"

import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"
import StoreHits from "@modules/store/components/store-hits"
import StoreRefinements from "@modules/store/components/store-refinements"
import StoreSearchBox from "@modules/store/components/store-search-box"

const PRODUCT_LIMIT = 12

const StoreTemplate = ({ currencyCode }: { currencyCode: string }) => {
  return (
    <div className="bg-[#faf9f6] text-[#24231f]">
      <div
        className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16"
        data-testid="category-container"
      >
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
            CURATED FOR YOU
          </p>
          <h1
            className="font-serif text-3xl font-light md:text-5xl"
            data-testid="store-page-title"
          >
            All products
          </h1>
        </div>

        <div className="flex flex-col small:flex-row small:items-start">
          <InstantSearch
            indexName={PRODUCT_INDEX_NAME}
            searchClient={searchClient as unknown as SearchClient}
            routing
            future={{ preserveSharedStateOnUnmount: true }}
          >
            <Configure hitsPerPage={PRODUCT_LIMIT} />
            <StoreRefinements currencyCode={currencyCode} />
            <div className="w-full min-w-0">
              <StoreSearchBox />
              <StoreHits
                hitsPerPage={PRODUCT_LIMIT}
                currencyCode={currencyCode}
              />
            </div>
          </InstantSearch>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate