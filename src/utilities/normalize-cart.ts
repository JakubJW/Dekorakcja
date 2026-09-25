import { Cart, Media, Product, Variant } from '@/payload-types'
import { populateGallery } from './normalizeProduct'
const isPopulated = <T>(value: T | number | null | undefined): value is T =>
  typeof value === 'object' && value !== null

type PopulatedCartItem = {
  id?: string | null
  slug?: string
  title: string
  isVariant: boolean
  variantOptions: Array<string | undefined> | undefined
  image?: Media
  price?: number | null
  quantity: number
}

type CartItem = {
  product?: (number | null) | Product
  variant?: (number | null) | Variant
  quantity: number
  id?: string | null
}

const populateImage = ({ product, variant }: CartItem) => {
  if (!isPopulated(product)) return undefined

  const gallery = populateGallery(product.gallery)

  if (isPopulated(variant)) {
    const imageVariant = gallery.find((item) => {
      if (!item.variantOption) return false

      const variantOptionID =
        typeof item.variantOption === 'object' ? item.variantOption.id : item.variantOption

      const hasMatch = variant.options.some((option) => {
        if (typeof option === 'object') return option.id === variantOptionID
        else return option === variantOptionID
      })

      return hasMatch
    })

    if (imageVariant) {
      return imageVariant.image
    }

    const metaImage =
      product.meta?.image && typeof product.meta?.image === 'object'
        ? product.meta.image
        : undefined

    const firstGalleryImage = typeof gallery[0].image === 'object' ? gallery[0].image : undefined

    return metaImage || firstGalleryImage
  }
}

const populatePrice = ({ product, variant }: CartItem) => {
  if (isPopulated(variant)) return variant.priceInPLN
  if (isPopulated(product)) return product.priceInPLN

  return 0
}

export const normalizeCartItems = (items: Cart['items']): PopulatedCartItem[] => {
  if (!items) return []

  return items.map((item) => ({
    id: item.id,
    title: typeof item.product === 'object' ? (item.product?.title ?? '') : '',
    image: populateImage(item),
    slug: typeof item.product === 'object' ? item.product?.slug : undefined,
    isVariant: Boolean(item.variant),
    price: populatePrice(item),
    quantity: item.quantity,
    variantOptions:
      typeof item.variant === 'object'
        ? typeof item.variant?.options === 'object'
          ? item.variant.options.map((option) =>
              typeof option === 'object' ? option.label : undefined,
            )
          : undefined
        : undefined,
  }))
}
