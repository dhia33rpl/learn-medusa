import { CreditCard } from "@medusajs/icons"
import React from "react"

export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Kartu Kredit",
    icon: <CreditCard />,
  },

  pp_system_default: {
    title: "Pembayaran Manual",
    icon: <CreditCard />,
  },
}

const MEDUSA_PAYMENTS_PREFIX = "pp_medusa-payments_"

const medusaPaymentsInfo = {
  title: "Kartu Kredit",
  icon: <CreditCard />,
}

const ADYEN_PREFIX = "pp_adyen_"

const adyenInfo = {
  title: "Kartu Kredit / Dompet Digital",
  icon: <CreditCard />,
}

export const getPaymentInfo = (providerId?: string) => {
  if (!providerId) {
    return undefined
  }

  if (isMedusaPayments(providerId)) {
    return medusaPaymentsInfo
  }

  if (isAdyen(providerId)) {
    return adyenInfo
  }

  return paymentInfoMap[providerId]
}

export const isAdyen = (providerId?: string) => {
  return !!providerId?.startsWith(ADYEN_PREFIX)
}

export const isMedusaPayments = (providerId?: string) => {
  return !!providerId?.startsWith(MEDUSA_PAYMENTS_PREFIX)
}

export const getMedusaPaymentsAccount = (paymentSession?: {
  provider_id: string
  data?: Record<string, unknown>
}) => {
  const account = paymentSession?.data?.stripe_account

  return isMedusaPayments(paymentSession?.provider_id) &&
    typeof account === "string"
    ? account
    : undefined
}

export const isStripeLike = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_") || isMedusaPayments(providerId)
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

export const noDivisionCurrencies: string[] = []
