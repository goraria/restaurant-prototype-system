import { appGlobal } from "@/constants/constants"

export interface FormatUtils {
  formatCurrency(value: number, currency: string): string
  formatDate(date: Date): string
}

export interface FormatCurrencyProps {
  value: number | string
  currency?: string
  locales?: string
}

export interface FormatDateTimeProps {
  date: Date | string
  locales?: string
}

export function formatCurrency({
  value,
  currency = appGlobal.currency,
  locales = appGlobal.locales
}: FormatCurrencyProps) {
  const numeric = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat(locales, {
    style: 'currency',
    currency
  }).format(numeric || 0)

  // return new Intl.NumberFormat(locales, {
  //   style: "currency",
  //   currency,
  // }).format(value)
}

export function formatDateTime({
  date,
  locales = appGlobal.locales
}: FormatDateTimeProps) {
  const object = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locales, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(object)

  // return new Intl.DateTimeFormat("vi-VN", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // }).format(date)
}