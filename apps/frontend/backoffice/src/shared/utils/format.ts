/**
 * Formats a numeric value into an institutional currency string in Brazilian Reais (BRL).
 *
 * @param amount - The numeric monetary value to format.
 * @param currency - The ISO 4217 currency code (defaults to 'BRL').
 * @param locale - The BCP 47 language tag (defaults to 'pt-BR').
 * @returns The formatted currency string.
 */
export const formatCurrency = (
  amount?: number | null,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string => {
  const isInvalidAmount = amount === undefined || amount === null || Number.isNaN(amount)
  if (isInvalidAmount) {
    return 'R$ 0,00'
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
 * @param locale - The BCP 47 language tag (defaults to 'pt-BR').
 * @returns The formatted date string.
 */
export const formatDate = (dateString?: string | null, locale: string = 'pt-BR'): string => {
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

/**
 * Formats a raw input string into a Brazilian Real (BRL) currency mask (e.g. '14990' -> 'R$ 149,90').
 *
 * @param value - The input string, containing digits or mixed characters.
 * @returns The formatted currency string, or empty string if no digits are present.
 */
export const formatCurrencyInput = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  if (!digits) {
    return ''
  }

  const numericValue = Number(digits) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue)
}

/**
 * Extracts the raw numeric value (in Reais float) from a masked currency string.
 *
 * @param value - The currency string (e.g. 'R$ 149,90').
 * @returns The numeric float value (e.g. 149.9).
 */
export const parseCurrencyToRaw = (value: string): number => {
  if (!value) {
    return 0
  }

  const digits = value.replace(/\D/g, '')
  if (!digits) {
    return 0
  }

  return Number(digits) / 100
}
