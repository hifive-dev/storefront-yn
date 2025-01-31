// External
import { Metadata } from "next"
import Image from "next/image"

import { getRegion } from "@lib/data/regions"
import { CategoryCarousel } from "@/components/category-carousel"
import { FeaturedBrands } from "@/components/featured-brands"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroSlider, SlideData } from "@/components/hero-slider"
import { getCollectionsList } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"

export const metadata: Metadata = {
  title: "Younithy",
  description: ""
}

// Log environment variables during build/runtime
console.log('Environment Variables:', {
  NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
  NODE_ENV: process.env.NODE_ENV,
})

const heroSlides: SlideData[] = [
  {
    image: "https://picsum.photos/1200/800?random=1",
    title: "Summer Collection",
    description: "Discover our latest arrivals for the season",
    cta: "Shop Now",
  },
  {
    image: "https://picsum.photos/1200/800?random=2",
    title: "New Accessories",
    description: "Complete your look with our trendy accessories",
    cta: "Explore",
  },
  {
    image: "https://picsum.photos/1200/800?random=3",
    title: "Sale Up to 50% Off",
    description: "Don't miss out on our biggest sale of the year",
    cta: "Shop Sale",
  },
]

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)
  const collections = await getCollectionsList()
  const categories = await listCategories()

  // Log runtime values
  console.log('Runtime Values:', {
    countryCode,
    regionId: region?.id,
    collectionsCount: collections.count,
    categoriesCount: categories?.length,
  })

  if (!region) {
    return null
  }

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <div className="flex flex-col gap-20 py-20">
        {/*// @ts-ignore*/}
        <CategoryCarousel categories={categories} />
        <FeaturedProducts />
        <FeaturedBrands/>
      </div>
    </>
  )
}
