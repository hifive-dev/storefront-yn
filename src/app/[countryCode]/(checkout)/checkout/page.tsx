import { Metadata } from "next"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { retrieveCart } from "@lib/data/cart"
import { getCustomer } from "@lib/data/customer"
import Wrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import MobileCheckoutSummary from "@modules/checkout/templates/mobile-checkout-summary"

export const metadata: Metadata = {
  title: "Checkout",
}

const fetchCart = async () => {
  const cart = await retrieveCart()
  if (!cart) {
    return notFound()
  }

  return cart
}

export default async function Checkout({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  const cart = (await fetchCart()) as HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  const customer = await getCustomer()

  return (
    <>
      <Layout className="lg:hidden">
        <LayoutColumn>
          <div className="flex justify-between items-center h-18">
            <LocalizedLink href="/" className="text-md font-medium">
              YOUNITHY
            </LocalizedLink>
            <div>
              <p className="font-semibold">Checkout</p>
            </div>
          </div>
        </LayoutColumn>
      </Layout>
      <div className="w-full bg-grayscale-50 lg:hidden">
        <Layout>
          <LayoutColumn>
            <MobileCheckoutSummary cart={cart} />
          </LayoutColumn>
        </Layout>
      </div>
      <Layout>
        <LayoutColumn className="flex max-lg:flex-col-reverse lg:justify-between">
          <div className="flex-1 pt-7 lg:max-w-125 xl:max-w-150 pb-9 lg:pb-40">
            <LocalizedLink
              href="/"
              className="text-md font-medium mb-16 inline-block max-lg:hidden"
            >
              YOUNITHY
            </LocalizedLink>
            <Wrapper cart={cart}>
              <CheckoutForm
                cart={cart}
                customer={customer}
                countryCode={countryCode}
              />
            </Wrapper>
          </div>
          <div className="relative lg:max-w-100 xl:max-w-123 flex-1 pt-32 max-lg:hidden z-10">
            <CheckoutSummary cart={cart} />
          </div>
        </LayoutColumn>
      </Layout>
      <div className="absolute right-0 top-0 w-[45%] bg-grayscale-50 h-full max-lg:hidden" />
    </>
  )
}
