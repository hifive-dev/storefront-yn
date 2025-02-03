import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "eu"

console.log(process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
console.log(process.env.MEDUSA_BACKEND_URL)
console.log(process.env.NEXT_PUBLIC_DEFAULT_REGION)

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  console.log("Debug - Current cache state:", {
    hasExistingRegions: regionMap.size > 0,
    lastUpdated: new Date(regionMapUpdated).toISOString(),
    timeSinceUpdate: Date.now() - regionMapUpdated,
  })

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    console.log("Debug - Fetching fresh regions data")
    console.log("Debug - Backend URL:", BACKEND_URL)
    console.log("Debug - API Key present:", !!PUBLISHABLE_API_KEY)

    try {
      // Fetch regions from Medusa
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
      })

      console.log("Debug - Fetch response status:", response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Debug - API Response:", {
        hasRegions: !!data.regions,
        regionCount: data.regions?.length,
      })

      const { regions } = data

      if (!regions?.length) {
        console.error("No regions found in API response")
        return regionMap
      }

      // Clear existing map before adding new entries
      regionMapCache.regionMap.clear()

      // Create a map of country codes to regions
      regions.forEach((region: HttpTypes.StoreRegion) => {
        const countryCodes = region.countries?.map(c => c.iso_2).filter(Boolean) || []
        console.log(`Debug - Adding region ${region.id} with countries:`, countryCodes)
        
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      console.log("Debug - Updated region map size:", regionMapCache.regionMap.size)
      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      console.error("Error fetching regions:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: BACKEND_URL,
        hasApiKey: !!PUBLISHABLE_API_KEY
      })
      return regionMap
    }
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param regionMap
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()
    
    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    console.log("Debug - Country code detection:", {
      vercelCountryCode,
      urlCountryCode,
      defaultRegion: DEFAULT_REGION,
      availableRegions: Array.from(regionMap.keys()),
    })

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    console.log("Debug - Selected country code:", countryCode)
    return countryCode
  } catch (error) {
    console.error("Error in getCountryCode:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      requestUrl: request.nextUrl.toString(),
    })
    
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  const regionMap = await getRegionMap()
  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

  // check if one of the country codes is in the url
  if (urlHasCountryCode) {
    return NextResponse.next()
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|images|robots.txt).*)",
  ],
}