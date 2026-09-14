/**
 * Formats a numeric value into an institutional currency string.
 *
 * @param amount - The numeric monetary value to format.
 * @param currency - The ISO 4217 currency code (defaults to 'USD').
 * @param locale - The BCP 47 language tag (defaults to 'en-US').
 * @returns The formatted currency string.
 */
export const formatCurrency = (
  amount?: number | null,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  const isInvalidAmount = amount === undefined || amount === null || Number.isNaN(amount)
  if (isInvalidAmount) {
    return '$0.00'
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Capitalizes the first character of a string.
 *
 * @param value - The input string to capitalize.
 * @returns The string with its initial letter capitalized.
 */
export const capitalizeText = (value?: string | null): string => {
  const hasValue = Boolean(value)
  if (!hasValue) {
    return ''
  }

  const safeValue = value!
  return `${safeValue.charAt(0).toUpperCase()}${safeValue.slice(1)}`
}

/**
 * Formats an ISO date string into a localized readable date.
 *
 * @param dateString - The ISO date string to format.
 * @param locale - The BCP 47 language tag (defaults to 'en-US').
 * @returns The formatted date string.
 */
export const formatDate = (dateString?: string | null, locale: string = 'en-US'): string => {
  const hasDateString = Boolean(dateString)
  if (!hasDateString) {
    return '—'
  }

  const parsedDate = new Date(dateString!)
  const isInvalidDate = Number.isNaN(parsedDate.getTime())
  if (isInvalidDate) {
    return '—'
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(parsedDate)
}
