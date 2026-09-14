/**
 * Formats a monetary number into a localized store currency string.
 *
 * @param amount - The numeric price to format.
 * @param currency - The ISO 4217 currency code (defaults to 'USD').
 * @param locale - The BCP 47 locale tag (defaults to 'en-US').
 * @returns The formatted currency string.
 */
export const formatStorePrice = (
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
 * Truncates product description text cleanly to a maximum length.
 *
 * @param text - The raw text string.
 * @param maxLength - Maximum number of characters allowed.
 * @returns The truncated string ending with an ellipsis.
 */
export const truncateDescription = (
  text?: string | null,
  maxLength: number = 80
): string => {
  const hasText = Boolean(text)
  if (!hasText) {
    return ''
  }

  const isWithinLengthLimit = (text?.length ?? 0) <= maxLength
  if (isWithinLengthLimit) {
    return text!
  }

  return `${text!.slice(0, maxLength)}…`
}
