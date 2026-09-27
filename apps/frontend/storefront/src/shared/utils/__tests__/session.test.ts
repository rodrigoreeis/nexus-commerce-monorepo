import { getOrCreateSessionId, getSessionId } from '../session'

describe('session utils', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('returns null when getSessionId is called on empty storage', () => {
    expect(getSessionId()).toBeNull()
  })

  it('generates, stores and returns a new session ID on getOrCreateSessionId', () => {
    const sessionId = getOrCreateSessionId()
    expect(sessionId).toBeTruthy()
    expect(typeof sessionId).toBe('string')
    expect(getSessionId()).toBe(sessionId)
  })

  it('reuses existing session ID when already present in sessionStorage', () => {
    sessionStorage.setItem('nexus_store_session_id', 'existing-session-456')
    const sessionId = getOrCreateSessionId()
    expect(sessionId).toBe('existing-session-456')
    expect(getSessionId()).toBe('existing-session-456')
  })
})
