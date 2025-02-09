// External components
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"

// Lib
import { listRegions } from "@lib/data/regions"

// Components
import { Layout, LayoutColumn } from "@/components/Layout"

export async function generateStaticParams() {
  try {
    const regions = await listRegions()
    
    if (!regions || !Array.isArray(regions)) {
      console.warn('No regions data available, falling back to default')
      return [{ countryCode: 'eu' }] // Fallback to US as default
    }

    const countryCodes = regions.flatMap((r: StoreRegion) =>
      r.countries
        ? r.countries
            .map((c) => c.iso_2)
            .filter(
              (value): value is string =>
                typeof value === "string" && Boolean(value)
            )
        : []
    )

    if (countryCodes.length === 0) {
      console.warn('No country codes found, falling back to default')
      return [{ countryCode: 'us' }]
    }

    return countryCodes.map((countryCode) => ({
      countryCode,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [{ countryCode: 'us' }] // Fallback to US as default
  }
}

export default function AboutPage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/icon.jpg"
          width={2880}
          height={1500}
          alt="Living room"
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-lg max-lg:mb-6 md:text-2xl">
              At Younithy, we believe that clothing is the heart of every
              person whos wearing it.
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-6 lg:mb-8">
                Welcome to Younithy, where we believe that comfort and style
                should be effortlessly intertwined. Our mission is to help you
                create beautiful, functional spaces that bring warmth and
                relaxation into your home.
              </p>
              <p>
                Every piece in our collection is designed with care, blending
                timeless craftsmanship with modern aesthetics to offer you the
                perfect balance between form and function.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn>
            <Image
              src="/images/cafe.jpg"
              width={2496}
              height={1404}
              alt="Living room"
              className="mt-26 lg:mt-36 mb-8 lg:mb-26"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
            <h3 className="text-lg lg:mb-10 mb-6 md:text-2xl">
              We are here to make your living space a true reflection of your
              personal style.
            </h3>
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, lg: 6 }}>
            <div className="mb-16 lg:mb-36">
              <p className="mb-6">
                At the heart of our brand is a deep commitment to quality. We
                understand.
              </p>
              <p>
                From luxurious leathers and soft linens to high-performance
                textiles, each fabric is carefully selected for its durability
                and beauty. Our attention to detail extends to every stitch and
                seam, guaranteeing that your closet will not only look stunning
                but will also withstand the test of time.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 2, lg: 1 }} end={{ base: 12, lg: 7 }}>
            <Image
              src="/images/brands.jpg"
              width={1200}
              height={1600}
              alt="Living room"
              className="mb-16 lg:mb-36"
            />
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="mb-6 lg:mb-20 xl:mb-36">
              <p>
                Our design philosophy revolves around creating pieces that are
                both beautiful and practical. Inspired by Scandinavian
                simplicity, modern luxury, and timeless classics, our
                collections are curated to suit a wide variety of tastes and
                lifestyles. We understand that every home is different, so we
                offer a diverse range of styles, colors, and textures to help
                you find the perfect fit. Whether you prefer sleek modern lines
                or soft, inviting silhouettes, we have something to suit every
                space and personality.
              </p>
            </div>
            <div className="md:text-md max-lg:mb-26">
              <p>
                We believe that great design should be environmentally
                conscious, which is why we strive to minimise our environmental
                footprint through responsible sourcing and production practices.
                Our commitment to sustainability ensures that our products are
                not only beautiful but also kind to the planet.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
        <Image
          src="/images/store.jpg"
          width={2880}
          height={1618}
          alt="Living room"
          className="mb-8 lg:mb-26"
        />
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-lg max-lg:mb-8 md:text-2xl">
              Our customers are at the center of everything we do!
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-6 lg:mb-8">
                Our team is here to help guide you through the process, offering
                personalised support to ensure that you find exactly what
                you&apos;re looking for.
              </p>
              <p>
                We&apos;re not just selling fashion - we&apos;re helping you
                create new styles.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
