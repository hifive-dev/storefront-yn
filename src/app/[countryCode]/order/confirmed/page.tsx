'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Heading } from "@medusajs/ui"
import { retrieveOrder } from "@lib/data/orders"
import { placeOrder } from "@lib/data/cart"
import LoadingContainer from "@modules/common/components/loading-container"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"

export default function OrderConfirmedPage() {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const paymentIntent = searchParams.get("payment_intent")

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      try {
        if (paymentIntent) {
          // First complete the order
          const result = await placeOrder()
          if (result?.id) {
            const orderData = await retrieveOrder(result.id)
            setOrder(orderData)
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching your order")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [paymentIntent])

  if (loading) {
    return <LoadingContainer />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <Heading level="h1" className="text-2xl mb-4">
          An error occurred
        </Heading>
        <p className="text-gray-700">{error}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <Heading level="h1" className="text-2xl mb-4">
          Order not found
        </Heading>
        <p className="text-gray-700">
          We couldn't find your order. Please try again or contact support.
        </p>
      </div>
    )
  }

  return <OrderCompletedTemplate order={order} />
} 