const SESSION_STORAGE_KEY = 'nexus_store_session_id'

/**
 * Retrieves the current anonymous session ID from sessionStorage.
 *
 * @returns Session ID string or null if not yet initialized or during SSR.
 */
export const getSessionId = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * Retrieves the current session ID or generates and persists a new UUID in sessionStorage.
 *
 * @returns Active session ID string.
 */
export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }
  try {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!sessionId) {
      sessionId =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId)
    }
    return sessionId
  } catch {
    return ''
  }
}
