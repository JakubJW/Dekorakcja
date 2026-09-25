import { FiltersConfig, prepareFilters } from '@/features/filters/prepare-filers'
import { populateGallery } from '@/utilities/normalizeProduct'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const getProductsList = async (filters?: FiltersConfig) => {
  const payload = await getPayload({ config: configPromise })
  const preparedFilters = filters ? prepareFilters(filters) : undefined

  const raw = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      occasions: true,
      priceInPLN: true,
    },
    ...preparedFilters,
  })

  return raw.docs.map((doc) => ({ ...doc, gallery: populateGallery(doc.gallery) }))
}
