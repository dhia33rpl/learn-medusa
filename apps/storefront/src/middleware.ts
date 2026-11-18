import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const DEFAULT_REGION = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "id"
).toLowerCase()

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: 0,
}

async function getRegionMap(): Promise<Map<string, HttpTypes.StoreRegion>> {
  if (!BACKEND_URL) {
    throw new Error("NEXT_PUBLIC_MEDUSA_BACKEND_URL belum dikonfigurasi.")
  }

  if (!PUBLISHABLE_API_KEY) {
    throw new Error("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY belum dikonfigurasi.")
  }

  const cacheExpired = Date.now() - regionMapCache.regionMapUpdated > 3600000

  if (!regionMapCache.regionMap.size || cacheExpired) {
    let response: Response

    try {
      response = await fetch(
        `${BACKEND_URL.replace(/\/$/, "")}/store/regions`,
        {
          method: "GET",
          headers: {
            "x-publishable-api-key": PUBLISHABLE_API_KEY,
          },
          cache: "no-store",
        }
      )
    } catch (error) {
      console.error("Medusa Backend connection error:", error)

      throw new Error(`Gagal terhubung ke Medusa Backend: ${BACKEND_URL}`)
    }

    if (!response.ok) {
      throw new Error(
        `Medusa Backend error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    const regions: HttpTypes.StoreRegion[] = data.regions ?? []

    regionMapCache.regionMap.clear()

    for (const region of regions) {
      for (const country of region.countries ?? []) {
        const code = country.iso_2?.toLowerCase()

        if (code) {
          regionMapCache.regionMap.set(code, region)
        }
      }
    }

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
): string | undefined {
  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

  if (urlCountryCode && regionMap.has(urlCountryCode)) {
    return urlCountryCode
  }

  if (regionMap.has(DEFAULT_REGION)) {
    return DEFAULT_REGION
  }

  return regionMap.keys().next().value
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const regionMap = await getRegionMap()
  const countryCode = getCountryCode(request, regionMap)

  if (!countryCode) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  const firstPathSegment = pathname.split("/")[1]?.toLowerCase()

  if (firstPathSegment === countryCode) {
    return NextResponse.next()
  }

  if (pathname === "/") {
    return NextResponse.rewrite(new URL(`/${countryCode}`, request.url))
  }

  const redirectUrl = new URL(request.url)

  redirectUrl.pathname = `/${countryCode}${pathname}`

  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: [
    "/((?!api|ucp|buy|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
