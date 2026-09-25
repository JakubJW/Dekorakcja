import { Media, Rentable } from '@/payload-types'
import { populateGallery } from './normalizeProduct'
const isPopulated = <T>(value: T | number | null | undefined): value is T =>
  typeof value === 'object' && value !== null

type PopulatedCartItem = {
  id?: string | null
  slug?: string
  title: string
  image?: Media
}

type RentalCartItem = {
  rentable?: (number | null) | Rentable
  id?: string | null
}

const populateImage = ({ rentable }: RentalCartItem) => {
  if (!isPopulated(rentable)) return undefined

  const gallery = populateGallery(rentable.gallery)

  const metaImage =
    rentable.meta?.image && typeof rentable.meta?.image === 'object'
      ? rentable.meta.image
      : undefined

  const firstGalleryImage = typeof gallery[0].image === 'object' ? gallery[0].image : undefined

  return metaImage || firstGalleryImage
}

export const normalizeRentalCartItems = (items: RentalCartItem[]): PopulatedCartItem[] => {
  if (!items) return []

  return items.map((item) => ({
    id: item.id,
    title: typeof item.rentable === 'object' ? (item.rentable?.title ?? '') : '',
    image: populateImage(item),
    slug: typeof item.rentable === 'object' ? item.rentable?.slug : undefined,
  }))
}
