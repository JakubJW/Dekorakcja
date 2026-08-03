import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { populateGallery } from '@/utilities/normalizeProduct'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, okazja } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const raw = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      occasions: true,
      priceInUSD: true,
    },
    ...(sort ? { sort } : { sort: 'title' }),
    ...(searchValue || okazja
      ? {
          where: {
            and: [
              {
                _status: {
                  equals: 'published',
                },
              },
              ...(searchValue
                ? [
                    {
                      or: [
                        {
                          title: {
                            like: searchValue,
                          },
                        },
                        // {
                        //   description: {
                        //     like: searchValue,
                        //   },
                        // },
                      ],
                    },
                  ]
                : []),
              ...(okazja
                ? [
                    {
                      occasions: {
                        contains: okazja,
                      },
                    },
                  ]
                : []),
            ],
          },
        }
      : {}),
  })

  const products = raw.docs.map((doc) => ({ ...doc, gallery: populateGallery(doc.gallery) }))
  const resultsText = products.length > 1 ? 'results' : 'result'

  return (
    <div>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.length === 0 && (
        <p className="mb-4">No products found. Please try different filters.</p>
      )}

      {products.length > 0 ? (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductGridItem key={product.id} product={product} />
          ))}
        </Grid>
      ) : null}
    </div>
  )
}
