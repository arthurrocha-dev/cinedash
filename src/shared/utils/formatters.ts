export function formatYear(dateString: string | null): string {
  if (!dateString) return 'N/A'
  return new Date(dateString).getFullYear().toString()
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
