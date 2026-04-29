import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../model/authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
  })

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('authenticates on login', () => {
    useAuthStore.getState().login('user@test.com', 'password123')
    const state = useAuthStore.getState()

    expect(state.isAuthenticated).toBe(true)
    expect(state.user).not.toBeNull()
    expect(state.user?.email).toBe('user@test.com')
    expect(state.token).not.toBeNull()
  })

  it('sets user name from email prefix', () => {
    useAuthStore.getState().login('john@example.com', 'pass123')
    expect(useAuthStore.getState().user?.name).toBe('john')
  })

  it('clears state on logout', () => {
    useAuthStore.getState().login('user@test.com', 'pass123')
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('rehydrate clears state if token is expired/invalid', () => {
    useAuthStore.setState({ token: 'invalid.token.data', isAuthenticated: true, user: null })
    useAuthStore.getState().rehydrate()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})
