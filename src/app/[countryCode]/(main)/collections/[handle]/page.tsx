import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getCollectionByHandle,
  getCollectionsList,
} from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { collectionMetadataCustomFieldsSchema } from "@lib/util/collections"
import { Collection } from "@/types/collection-data"
import { HeroSlider, SlideData } from "@/components/hero-slider"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    category?: string | string[]
    type?: string | string[]
    page?: string
    sortBy?: SortOptions
  }>
}

export async function generateStaticParams() {
  const { collections } = await getCollectionsList()

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params

  const collection = await getCollectionByHandle(handle, [
    "id",
    "title",
    "metadata",
  ])
  if (!collection) {
    notFound()
  }

  const collectionDetails = collectionMetadataCustomFieldsSchema.safeParse(
    collection.metadata ?? {}
  )

  return {
    title: `${collection.title} | Medusa Store`,
    description:
      collectionDetails.success && collectionDetails.data.description
        ? collectionDetails.data.description
        : `${collection.title} collection`,
  } as Metadata
}

const mockCollections: Collection[] = [
  {
    collectionName: "ØLÅF",
    image: {
      id: "pal-sporting-goods-image-id",
      url: "/images/collection/olaf/header-olaf.jpg",
    },
    description:
      "Discover ØLÅF at Younithy – in-store and online. Inspired by global cultures and the power of shared experiences, it redefines how we live, create, and explore together. At Younithy, we celebrate their mission, offering you the chance to join this journey. Shop the collection that turns ambition into success and brings people closer – because life is better when lived as friends. Explore OLAF HUSSEIN with us.",
    collection_page_image: {
      id: "pal-sporting-goods-page-image-id",
      url: "https://example.com/images/pal-sporting-goods-page.jpg",
    },
    collection_page_heading: "ØLÅF HUSSEIN: Connection, Redefined at Younithy",
    collection_page_content:
      "Discover the latest from PAL Sporting Goods, a brand known for its premium quality and timeless style.",
    product_page_heading: "PAL Sporting Goods – Shop the Collection",
    product_page_image: {
      id: "pal-sporting-goods-product-image-id",
      url: "https://example.com/images/pal-sporting-goods-product.jpg",
    },
    product_page_wide_image: {
      id: "pal-sporting-goods-wide-image-id",
      url: "https://example.com/images/pal-sporting-goods-wide.jpg",
    },
    product_page_cta_image: {
      id: "pal-sporting-goods-cta-image-id",
      url: "https://example.com/images/pal-sporting-goods-cta.jpg",
    },
    product_page_cta_heading: "Upgrade with PAL Sporting Goods",
    product_page_cta_link:
      "https://younithy.com/collections/pal-sporting-goods",
  },
  {
    collectionName: "PAL Sporting Goods",
    image: {
      id: "pal-sporting-goods-image-id",
      url: "/images/collection/pal/pal-header.png",
    },
    description:
      "We are proud to offer PAL Sporting Goods at Younithy. Discover the unique style and outstanding quality that PAL Sporting Goods brings to their collections.",
    collection_page_image: {
      id: "pal-sporting-goods-page-image-id",
      url: "https://example.com/images/pal-sporting-goods-page.jpg",
    },
    collection_page_heading: "Explore PAL Sporting Goods at Younithy",
    collection_page_content:
      "Discover the latest from PAL Sporting Goods, a brand known for its premium quality and timeless style.",
    product_page_heading: "PAL Sporting Goods – Shop the Collection",
    product_page_image: {
      id: "pal-sporting-goods-product-image-id",
      url: "https://example.com/images/pal-sporting-goods-product.jpg",
    },
    product_page_wide_image: {
      id: "pal-sporting-goods-wide-image-id",
      url: "https://example.com/images/pal-sporting-goods-wide.jpg",
    },
    product_page_cta_image: {
      id: "pal-sporting-goods-cta-image-id",
      url: "https://example.com/images/pal-sporting-goods-cta.jpg",
    },
    product_page_cta_heading: "Upgrade with PAL Sporting Goods",
    product_page_cta_link:
      "https://younithy.com/collections/pal-sporting-goods",
  },
  {
    collectionName: "Arte Antwerp",
    image: {
      id: "arte-image-id",
      url: "/images/collection/arte-antwerp/arte-header.png",
    },
    description:
      "Arte Antwerp: A fusion of contemporary art and fashion, reflecting Antwerp’s cultural pulse. Available at Younithy in-store and online.",
    collection_page_image: {
      id: "arte-antwerp-page-image-id",
      url: "https://example.com/images/arte-antwerp-page.jpg",
    },
    collection_page_heading: "Arte Antwerp at Younithy",
    collection_page_content:
      "Explore Arte Antwerp’s artistic approach to fashion at Younithy. Discover bold designs, contemporary silhouettes, and a creative edge that redefines modern style.",
    product_page_heading: "Arte Antwerp – Shop Now",
    product_page_image: {
      id: "arte-antwerp-product-image-id",
      url: "https://example.com/images/arte-antwerp-product.jpg",
    },
    product_page_wide_image: {
      id: "arte-antwerp-wide-image-id",
      url: "https://example.com/images/arte-antwerp-wide.jpg",
    },
    product_page_cta_image: {
      id: "arte-antwerp-cta-image-id",
      url: "https://example.com/images/arte-antwerp-cta.jpg",
    },
    product_page_cta_heading: "Shop Arte Antwerp Now",
    product_page_cta_link: "https://younithy.com/collections/arte-antwerp",
  },
  {
    collectionName: "OBEY",
    image: { id: "obey-image-id", url: "https://example.com/images/obey.jpg" },
    description:
      "OBEY: A rebellious spirit turned cultural phenomenon, blending streetwear with social commentary. Available at Younithy in-store and online.",
    collection_page_image: {
      id: "obey-page-image-id",
      url: "https://example.com/images/obey-page.jpg",
    },
    collection_page_heading: "OBEY – Streetwear at Younithy",
    collection_page_content:
      "Join the movement with OBEY at Younithy. Embrace iconic streetwear designs inspired by activism, art, and individuality.",
    product_page_heading: "OBEY – Explore the Collection",
    product_page_image: {
      id: "obey-product-image-id",
      url: "https://example.com/images/obey-product.jpg",
    },
    product_page_wide_image: {
      id: "obey-wide-image-id",
      url: "https://example.com/images/obey-wide.jpg",
    },
    product_page_cta_image: {
      id: "obey-cta-image-id",
      url: "https://example.com/images/obey-cta.jpg",
    },
    product_page_cta_heading: "Shop OBEY Now",
    product_page_cta_link: "https://younithy.com/collections/obey",
  },
  // Add similar objects for each collection below:
  {
    collectionName: "FLÂNEUR",
    image: {
      id: "flaneur-image-id",
      url: "https://example.com/images/flaneur.jpg",
    },
    description:
      "FLÂNEUR: Effortless Parisian elegance meets modern casualwear. Available at Younithy in-store and online.",
    collection_page_image: {
      id: "flaneur-page-image-id",
      url: "https://example.com/images/flaneur-page.jpg",
    },
    collection_page_heading: "FLÂNEUR at Younithy",
    collection_page_content:
      "Discover FLÂNEUR’s minimalist designs at Younithy. Perfect for those who value understated luxury and timeless versatility.",
    product_page_heading: "Explore FLÂNEUR at Younithy",
    product_page_image: {
      id: "flaneur-product-image-id",
      url: "https://example.com/images/flaneur-product.jpg",
    },
    product_page_wide_image: {
      id: "flaneur-wide-image-id",
      url: "https://example.com/images/flaneur-wide.jpg",
    },
    product_page_cta_image: {
      id: "flaneur-cta-image-id",
      url: "https://example.com/images/flaneur-cta.jpg",
    },
    product_page_cta_heading: "Shop FLÂNEUR Now",
    product_page_cta_link: "https://younithy.com/collections/flaneur",
  },
  {
    collectionName: "DAILY PAPER",
    description:
      "DAILY PAPER: A contemporary fashion brand rooted in African heritage and culture. Available at Younithy in-store and online.",
    collection_page_heading: "DAILY PAPER at Younithy",
    collection_page_content:
      "Celebrate cultural heritage with DAILY PAPER at Younithy. Bold designs and unique stories come together in every piece.",
  },
  {
    collectionName: "New Amsterdam Surf Association",
    description:
      "New Amsterdam Surf Association: Urban surfwear inspired by Dutch grit and creativity. Available at Younithy in-store and online.",
    collection_page_heading: "New Amsterdam Surf Association at Younithy",
    collection_page_content:
      "Ride the wave of urban surfwear with New Amsterdam Surf Association at Younithy. Bold and functional designs for the city and the sea.",
  },
  {
    collectionName: "Samsøe Samsøe",
    description:
      "Samsøe Samsøe: Nordic minimalism with a contemporary edge. Available at Younithy in-store and online.",
    collection_page_heading: "Samsøe Samsøe at Younithy",
    collection_page_content:
      "Discover Samsøe Samsøe’s timeless Scandinavian style at Younithy. Clean lines and premium fabrics for everyday sophistication.",
  },
  {
    collectionName: "Carhartt WIP",
    description:
      "Carhartt WIP: Iconic workwear reimagined for the modern wardrobe. Available at Younithy in-store and online.",
    collection_page_heading: "Carhartt WIP at Younithy",
    collection_page_content:
      "Shop Carhartt WIP at Younithy and experience the evolution of workwear into everyday streetwear staples.",
  },
  {
    collectionName: "EDWIN",
    image: {
      id: "edwin-image-id",
      url: "/images/collection/edwin/edwin-header.jpg",
    },
    description:
      "EDWIN: Premium Japanese denim with a heritage of craftsmanship. Available at Younithy in-store and online.",
    collection_page_heading: "EDWIN at Younithy",
    collection_page_content:
      "Experience EDWIN’s legacy of craftsmanship and innovation at Younithy. Timeless denim redefined for modern living.",
  },
  {
    collectionName: "Pleasures",
    description:
      "Pleasures: Bold graphics and thought-provoking designs rooted in subculture. Available at Younithy in-store and online.",
    collection_page_heading: "Pleasures at Younithy",
    collection_page_content:
      "Express yourself with Pleasures at Younithy. A brand that blends statement graphics with a rebellious edge.",
  },
  {
    collectionName: "Service Works",
    description:
      "Service Works: Functional workwear-inspired designs for everyday wear. Available at Younithy in-store and online.",
    collection_page_heading: "Service Works at Younithy",
    collection_page_content:
      "Find Service Works at Younithy – durable, stylish workwear that adapts to your lifestyle.",
  },
  {
    collectionName: "Topologie",
    description:
      "Topologie: Innovative accessories inspired by climbing culture. Available at Younithy in-store and online.",
    collection_page_heading: "Topologie at Younithy",
    collection_page_content:
      "Explore Topologie’s functional and stylish accessories at Younithy. Inspired by adventure, designed for everyday life.",
  },
  {
    collectionName: "S.W.C.",
    description:
      "S.W.C.: Subtle, minimalist footwear with timeless appeal. Available at Younithy in-store and online.",
    collection_page_heading: "S.W.C. at Younithy",
    collection_page_content:
      "Step into simplicity with S.W.C. at Younithy. Clean designs crafted for understated elegance.",
  },
  {
    collectionName: "Le Bonnet",
    description:
      "Le Bonnet: Luxurious knitwear made with care and sustainability. Available at Younithy in-store and online.",
    collection_page_heading: "Le Bonnet at Younithy",
    collection_page_content:
      "Discover Le Bonnet’s premium knitwear at Younithy. Timeless comfort crafted with sustainable elegance.",
  },
  {
    collectionName: "Mizuno",
    description:
      "Mizuno: Performance-driven footwear and apparel for athletes. Available at Younithy in-store and online.",
    collection_page_heading: "Mizuno at Younithy",
    collection_page_content:
      "Enhance your performance with Mizuno at Younithy. Innovative designs for active lifestyles.",
  },
  {
    collectionName: "Saucony",
    description:
      "Saucony: Iconic running shoes and activewear designed for peak performance. Available at Younithy in-store and online.",
    collection_page_heading: "Saucony at Younithy",
    collection_page_content:
      "Run your best with Saucony at Younithy. Performance footwear crafted for comfort and speed.",
  },
  {
    collectionName: "Yeans",
    description:
      "Yeans: Modern denim with a focus on fit and style. Available at Younithy in-store and online.",
    collection_page_heading: "Yeans at Younithy",
    collection_page_content:
      "Redefine denim with Yeans at Younithy. Discover stylish, versatile jeans for every occasion.",
  },
  {
    collectionName: "YOUNITHY",
    image: {
      id: "younithy-image-id",
      url: "https://example.com/images/younithy.jpg",
    },
    description:
      "Younithy is your destination for exclusive collections that elevate your wardrobe with modern fashion.",
    collection_page_image: {
      id: "younithy-page-image-id",
      url: "https://example.com/images/younithy-page.jpg",
    },
    collection_page_heading: "YOUNITHY – Exclusive Fashion",
    collection_page_content:
      "Shop Younithy's curated collections of premium brands and modern styles.",
    product_page_heading: "Explore YOUNITHY Exclusives",
    product_page_image: {
      id: "younithy-product-image-id",
      url: "https://example.com/images/younithy-product.jpg",
    },
    product_page_wide_image: {
      id: "younithy-wide-image-id",
      url: "https://example.com/images/younithy-wide.jpg",
    },
    product_page_cta_image: {
      id: "younithy-cta-image-id",
      url: "https://example.com/images/younithy-cta.jpg",
    },
    product_page_cta_heading: "Shop YOUNITHY Now",
    product_page_cta_link: "https://younithy.com/collections/younithy",
  },
  // Repeat for remaining collections in a similar format...
]
const heroSlides: SlideData[] = [
  {
    image: "/images/collection/arte-antwerp/arte-header.png",
    title: "Summer Collection",
    description: "Discover our latest arrivals for the season",
    cta: "Shop Now",
  }
]
export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle, countryCode } = await params
  const { sortBy, page, category } = await searchParams

  const collection = await getCollectionByHandle(handle, [
    "id",
    "title",
    "metadata",
  ])
  const collectionData =
    mockCollections.find((c) => c.collectionName === collection.title) || null

  if (!collection) {
    notFound()
  }
  const headerSlide: SlideData = {
    image: `/images/collection/${collection.title}/${collection.title}-header.png`,
    title: collectionData?.collection_page_heading || collection.title,
    description: collectionData?.collection_page_content,
  }

  return (
    <>
      <HeroSlider slides={[headerSlide]} isSingleSlide={true} />
      <CollectionTemplate
        collectionData={collectionData!}
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={countryCode}
        category={
          !category ? undefined : Array.isArray(category) ? category : [category]
        }
      />
      </>
  )
}
