import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

const currencyLocales: Record<string, string> = {
  idr: "id-ID",
  eur: "de-DE",
  usd: "en-US",
  gbp: "en-GB",
  aud: "en-AU",
  cad: "en-CA",
  sgd: "en-SG",
  jpy: "ja-JP",
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  const code = currency_code.toLowerCase()
  const selectedLocale = locale || currencyLocales[code] || "en-US"

  return new Intl.NumberFormat(selectedLocale, {
    style: "currency",
    currency: code.toUpperCase(),
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}
