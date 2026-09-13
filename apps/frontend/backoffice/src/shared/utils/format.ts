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
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
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
  if (!value) {
    return ''
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}
