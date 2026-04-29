import { describe, it, expect } from 'vitest'
import { loginSchema } from '../model/authSchema'

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toContain('email')
  })

  it('rejects password shorter than 6 chars', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '12345' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toContain('password')
  })

  it('rejects empty fields', () => {
    const result = loginSchema.safeParse({ email: '', password: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues).toHaveLength(2)
  })
})
