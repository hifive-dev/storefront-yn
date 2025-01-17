import { Metadata } from "next";
import { getBaseURL } from "@lib/util/env";
import { Footer } from "@/components/Footer";
import { getRegion, listRegions } from "@lib/data/regions"
import { SiteHeader } from "@/components/header/site-header"
import { getCollectionsList } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { InstagramCarousel } from "@/components/instagram-carousel"
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};


export default async function PageLayout(props: { children: React.ReactNode }) {
  const regions = await listRegions()
  const categories = await listCategories()

  const countryOptions = regions
    .map((r) => {
      return (r.countries ?? []).map((c) => ({
        country: c.iso_2,
        region: r.id,
        label: c.display_name,
      }))
    })
    .flat()
    .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <SiteHeader categories={categories} />
      {props.children}
      <InstagramCarousel />
      <Footer />
    </div>
  )
}
