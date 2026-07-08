export const getInitials = (name: string) => {
  const segments = name.split(' ')
  const validated = segments.length === 2

  if (!validated) return null

  return segments[0].charAt(0) + segments[1].charAt(0)
}
