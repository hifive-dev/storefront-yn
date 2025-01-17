"use client"

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RadioGroup } from "react-aria-components"
import { twJoin } from "tailwind-merge"
import { StripeCardElementOptions } from "@stripe/stripe-js"

import ErrorMessage from "@modules/checkout/components/error-message"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { PaymentContainer } from "@modules/checkout/components/payment-container"
import { StripeContext } from "@modules/checkout/components/payment-wrapper"
import { Button } from "@/components/Button"

type PaymentProps = {
  cart: any
  availablePaymentMethods: any[]
}

const Payment: React.FC<PaymentProps> = ({ cart, availablePaymentMethods }) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"
  const isStripe = isStripeFunc(activeSession?.provider_id)
  const stripeReady = useContext(StripeContext)

  const paymentReady = activeSession && cart?.shipping_methods.length !== 0

  const useOptions: StripeCardElementOptions = useMemo(() => ({
    style: {
      base: {
        fontFamily: "Inter, sans-serif",
        color: "#424270",
        "::placeholder": {
          color: "rgb(107 114 128)",
        },
      },
    },
    classes: {
      base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
    },
  }), [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(`${pathname}?${createQueryString("step", "payment")}`, {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const shouldInputCard = isStripeFunc(selectedPaymentMethod) && !activeSession

      if (!activeSession) {
        await initiatePaymentSession(selectedPaymentMethod)
      }

      if (!shouldInputCard) {
        router.push(`${pathname}?${createQueryString("step", "review")}`, {
          scroll: false,
        })
      }
    } catch (err: any) {
      console.error("Payment setup error:", err)
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <>
      <PaymentHeader isOpen={isOpen} paymentReady={paymentReady} handleEdit={handleEdit} />
      {isOpen ? (
        <OpenPaymentSection
          availablePaymentMethods={availablePaymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          error={error}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
      ) : (
        <ClosedPaymentSection
          cart={cart}
          paymentReady={paymentReady}
          activeSession={activeSession}
          selectedPaymentMethod={selectedPaymentMethod}
        />
      )}
      <Button
        className="mt-6"
        onPress={handleSubmit}
        isLoading={isLoading}
        disabled={
          (isStripe || !selectedPaymentMethod)
        }
        data-testid="submit-payment-button"
      >
        {!activeSession && "Continue to review"}
      </Button>
    </>
  )
}

const PaymentHeader: React.FC<{ isOpen: boolean; paymentReady: boolean; handleEdit: () => void }> = ({ isOpen, paymentReady, handleEdit }) => (
  <div className="flex justify-between mb-8 border-t border-grayscale-200 pt-8 mt-8">
    <p className={twJoin("transition-fontWeight duration-75", isOpen && "font-semibold")}>
      4. Payment
    </p>
    {!isOpen && paymentReady && (
      <Button variant="link" onPress={handleEdit}>
        Change
      </Button>
    )}
  </div>
)

const OpenPaymentSection: React.FC<{
  availablePaymentMethods: any[]
  selectedPaymentMethod: string
  setSelectedPaymentMethod: (method: string) => void
  error: string | null
  isLoading: boolean
  handleSubmit: () => void
}> = ({
  availablePaymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  error,
  isLoading,
  handleSubmit,
}) => (
  <div>
    {availablePaymentMethods?.length > 0 && (
      <RadioGroup
        value={selectedPaymentMethod}
        onChange={setSelectedPaymentMethod}
        aria-label="Payment methods"
      >
        {availablePaymentMethods
          .sort((a, b) => {
            const idA = a.provider_id || a.id || ""
            const idB = b.provider_id || b.id || ""
            return idA.localeCompare(idB)
          })
          .map((paymentMethod) => (
            <PaymentContainer
              paymentInfoMap={paymentInfoMap}
              paymentProviderId={paymentMethod.provider_id || paymentMethod.id}
              key={paymentMethod.id}
            />
          ))}
      </RadioGroup>
    )}
    <Button onClick={handleSubmit}>betaal</Button>
    <ErrorMessage error={error} data-testid="payment-method-error-message" />
  </div>
)

const ClosedPaymentSection: React.FC<{
  cart: any
  paymentReady: boolean
  activeSession: any
  selectedPaymentMethod: string
}> = ({ cart, paymentReady, activeSession, selectedPaymentMethod }) => (
  <div className="block">
    {cart && paymentReady && activeSession && (
      <div className="flex flex-col gap-4">
        <div className="flex gap-10">
          <div className="text-grayscale-500">Payment method</div>
          <div>
            {paymentInfoMap[selectedPaymentMethod]?.title ||
              selectedPaymentMethod}
          </div>
        </div>
      </div>
    )}
  </div>
)

const getErrorMessage = (err: any): string => {
  if (err.message.includes("Error setting up the request")) {
    if (err.message.includes("creating a Stripe customer")) {
      return "There was a problem creating your customer profile. Please ensure all your information is correct and try again."
    }
    return "There was an issue setting up the payment. Please try again or contact support."
  }
  return err.message || "An unexpected error occurred. Please try again."
}

export default Payment