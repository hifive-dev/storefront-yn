// External
import { Metadata } from "next"
import Image from "next/image"

import { getRegion } from "@lib/data/regions"
import { getProductTypesList } from "@lib/data/product-types"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CategoryCarousel } from "@/components/category-carousel"
import { FeaturedBrands } from "@/components/featured-brands"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroSlider, SlideData } from "@/components/hero-slider"
import { getCollectionsList } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { InstagramCarousel } from "@/components/instagram-carousel"

export const metadata: Metadata = {
  title: "Younithy",
  description: ""
}
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
