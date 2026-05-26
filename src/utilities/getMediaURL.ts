/**
 * Resolves a media `url` for the frontend.
 * Local uploads are relative (`/api/media/file/...`); cloud storage returns absolute URLs.
 */
export function getMediaURL(url?: string | null): string {
  if (!url) return ''

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${url}`
}
