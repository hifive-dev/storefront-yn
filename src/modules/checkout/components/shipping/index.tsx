"use client"

import React, { useEffect, useState, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({ cart }) => {
  const [loading, setLoading] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<
    HttpTypes.StoreCartShippingOption[]
  >([])
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number>>({})
  const [selectedShippingOption, setSelectedShippingOption] = useState<string | undefined>()

  // Fetch available shipping options for the cart
  useEffect(() => {
    if (!cart) return

    const fetchShippingOptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/store/shipping-options?cart_id=${cart.id}`,
          {
            credentials: "include",
            headers: {
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
            },
          }
        )
        const data = await response.json()
        setShippingOptions(data.shipping_options || [])
      } catch (error) {
        console.error("Error fetching shipping options:", error)
      }
    }

    fetchShippingOptions()
  }, [cart])

  // Calculate prices for dynamic shipping options
  useEffect(() => {
    if (!cart || !shippingOptions.length) return

    const calculatePrices = async () => {
      try {
        const promises = shippingOptions
          .filter((option) => option.price_type === "calculated")
          .map(async (option) => {
            const response = await fetch(
              `http://localhost:9000/store/shipping-options/${option.id}/calculate`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
                },
                body: JSON.stringify({ cart_id: cart.id }),
              }
            )
            return response.json()
          })

        const results = await Promise.allSettled(promises)
        const prices: Record<string, number> = {}

        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value?.shipping_option) {
            const { id, amount } = result.value.shipping_option
            prices[id] = amount
          }
        })

        setCalculatedPrices(prices)
      } catch (error) {
        console.error("Error calculating shipping prices:", error)
      }
    }

    calculatePrices()
  }, [shippingOptions, cart])

  // Format price to localized currency
  const formatPrice = useCallback(
    (amount: number): string =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: cart?.currency_code,
      }).format(amount),
    [cart?.currency_code]
  )

  // Get price for a specific shipping option
  const getShippingOptionPrice = useCallback(
    (option: HttpTypes.StoreCartShippingOption): string | undefined => {
      if (option.price_type === "flat") return formatPrice(option.amount)
      if (calculatedPrices[option.id] !== undefined) return formatPrice(calculatedPrices[option.id])
      return undefined
    },
    [calculatedPrices, formatPrice]
  )

  // Set selected shipping method for the cart
  const handleSetShipping = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!cart || !selectedShippingOption) return

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:9000/store/carts/${cart.id}/shipping-methods`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
          },
          body: JSON.stringify({ option_id: selectedShippingOption }),
        }
      )
      const data = await response.json()
      console.log("Updated cart with shipping method:", data)
    } catch (error) {
      console.error("Error setting shipping method:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Shipping Options</h2>
      {loading && <span>Loading...</span>}
      {!loading && shippingOptions.length > 0 ? (
        <form>
          <label htmlFor="shipping-options" className="block mb-2">
            Select a shipping method:
          </label>
          <select
            id="shipping-options"
            className="border rounded w-full mb-4"
            value={selectedShippingOption}
            onChange={(e) => setSelectedShippingOption(e.target.value)}
          >
            <option key="ZERO" value={0} >
              Selecteer
            </option>
            {shippingOptions.map((option) => {
              const price = getShippingOptionPrice(option)
              return (
                <option key={option.id} value={option.id} disabled={!price}>
                  {option.name} - {price || "Calculating..."}
                </option>
              )
            })}
          </select>
          {selectedShippingOption}
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-black rounded disabled:opacity-50"
            onClick={handleSetShipping}
            disabled={!selectedShippingOption || loading}
          >
            Save
          </button>
        </form>
      ) : (
        <p>No shipping options available.</p>
      )}
    </div>
  )
}

export default React.memo(Shipping)
