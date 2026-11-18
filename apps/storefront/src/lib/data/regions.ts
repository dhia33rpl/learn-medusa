"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async (): Promise<HttpTypes.StoreRegion[]> => {
  const { regions } = await sdk.client.fetch<{
    regions: HttpTypes.StoreRegion[]
  }>("/store/regions", {
    method: "GET",
    cache: "no-store",
  })

  return regions
}

export const retrieveRegion = async (
  id: string
): Promise<HttpTypes.StoreRegion> => {
  const { region } = await sdk.client.fetch<{
    region: HttpTypes.StoreRegion
  }>(`/store/regions/${id}`, {
    method: "GET",
    cache: "no-store",
  })

  return region
}

export const getRegion = async (
  countryCode: string
): Promise<HttpTypes.StoreRegion | null> => {
  if (!countryCode) {
    return null
  }

  const regions = await listRegions()

  const region = regions.find((region) =>
    region.countries?.some(
      (country) => country.iso_2?.toLowerCase() === countryCode.toLowerCase()
    )
  )

  return region ?? null
}
