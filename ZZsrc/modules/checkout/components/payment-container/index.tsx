"use client"
import React, { useEffect, useState } from "react"
import { UiRadio, UiRadioBox } from "@/components/ui/Radio"

type PaymentContainerProps = {
  paymentProviderId: string
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: React.ReactNode }>
}

export const PaymentContainer: React.FC<PaymentContainerProps> = ({
                                                                    paymentProviderId,
                                                                    paymentInfoMap,
                                                                    disabled = false,
                                                                  }) => {
  const [clientSidePaymentInfo, setClientSidePaymentInfo] = useState<typeof paymentInfoMap>({})

  useEffect(() => {
    setClientSidePaymentInfo(paymentInfoMap)
  }, [paymentInfoMap])

  return (
    <UiRadio
      key={paymentProviderId}
      variant="outline"
      value={paymentProviderId}
      isDisabled={disabled}
      className="gap-4"
    >
      <UiRadioBox />
      <div className="group-data-[selected=true]:font-normal">
        {clientSidePaymentInfo[paymentProviderId]?.title || paymentProviderId}
      </div>
      <span className="ml-auto group-data-[selected=true]:font-normal">
        {clientSidePaymentInfo[paymentProviderId]?.icon}
      </span>
    </UiRadio>
  )
}