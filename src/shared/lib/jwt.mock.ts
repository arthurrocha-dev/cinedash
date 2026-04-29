interface JwtPayload {
  sub: string
  email: string
  name: string
  iat: number
  exp: number
}

export function signToken(email: string, name: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: crypto.randomUUID(),
      email,
      name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    } satisfies JwtPayload),
  )
  const signature = btoa(`${header}.${payload}`)
  return `${header}.${payload}.${signature}`
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    const payload = JSON.parse(atob(parts[1])) as JwtPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}
