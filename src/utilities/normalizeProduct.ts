import type { Media, Product, Variant, VariantOption, VariantType } from '@/payload-types'

const isPopulated = <T>(value: T | number | null | undefined): value is T =>
  typeof value === 'object' && value !== null

export type PopulatedVariant = Omit<Variant, 'options'> & { options: VariantOption[] }
export type PopulatedVariantType = Omit<VariantType, 'options'> & { options: VariantOption[] }
export type PopulatedProduct = Omit<
  Product,
  'variants' | 'variantTypes' | 'gallery' | 'relatedProducts'
> & {
  variants: PopulatedVariant[]
  variantTypes: PopulatedVariantType[]
  gallery: PopulatedGalleryItem[]
  relatedProducts: PopulatedProduct[]
}
export type GalleryItem = NonNullable<Product['gallery']>[number]
export type PopulatedGalleryItem = Omit<GalleryItem, 'variantOption' | 'image'> & {
  variantOption?: VariantOption
  image: Media
}
export type ProductListItem = Pick<
  Product,
  'id' | 'title' | 'slug' | 'priceInPLN' | 'occasions'
> & {
  gallery: PopulatedGalleryItem[]
}

/** Resolves gallery items whose `image` relation is populated, dropping the rest. */
export function populateGallery(gallery: Product['gallery']): PopulatedGalleryItem[] {
  return (gallery ?? [])
    .filter((galleryItem) => isPopulated<Media>(galleryItem.image))
    .map((galleryItem) => ({
      ...galleryItem,
      image: galleryItem.image as Media,
      variantOption: isPopulated<VariantOption>(galleryItem.variantOption)
        ? galleryItem.variantOption
        : undefined,
    }))
}

/** Resolves a product's variants and each variant's options. */
export function populateVariants(variants: Product['variants']): PopulatedVariant[] {
  return (variants?.docs ?? []).filter(isPopulated<Variant>).map((variant) => ({
    ...variant,
    options: (variant.options ?? []).filter(isPopulated<VariantOption>),
  }))
}

/** Resolves a product's variant types and each type's options. */
export function populateVariantTypes(
  variantTypes: Product['variantTypes'],
): PopulatedVariantType[] {
  return (variantTypes ?? []).filter(isPopulated<VariantType>).map((type) => ({
    ...type,
    options: (type.options?.docs ?? []).filter(isPopulated<VariantOption>),
  }))
}

/**
 * Resolves related products, normalizing each one in turn.
 *
 * `relatedProducts` is a self-reference and can form cycles (A relates to B,
 * B relates back to A), so `relatedDepth` bounds the recursion rather than
 * tracking visited ids — nested related products get their own
 * `relatedProducts` collapsed to `[]` once the budget runs out.
 */
export function populateRelatedProducts(
  relatedProducts: Product['relatedProducts'],
  relatedDepth = 1,
): PopulatedProduct[] {
  if (relatedDepth <= 0) return []

  return (relatedProducts ?? [])
    .filter(isPopulated<Product>)
    .map((related) => normalizeProduct(related, relatedDepth - 1))
}

/**
 * Payload relationship fields come back as `number | T` depending on query depth.
 * Resolve them once here so downstream code only ever deals with populated docs.
 * Unpopulated/dangling references are dropped rather than surfaced as numbers.
 */
export function normalizeProduct(product: Product, relatedDepth = 1): PopulatedProduct {
  return {
    ...product,
    gallery: populateGallery(product.gallery),
    relatedProducts: populateRelatedProducts(product.relatedProducts, relatedDepth),
    variants: populateVariants(product.variants),
    variantTypes: populateVariantTypes(product.variantTypes),
  }
}
