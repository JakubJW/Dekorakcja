import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { getProductsList } from '@/features/shop/queries'
import { SearchParams } from '@/shared/types'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Sklep | Dekorakcja',
}

export default async function ShopPage({ searchParams }: SearchParams) {
  const { q: searchValue, sort, okazja } = await searchParams
  const products = await getProductsList({ searchValue, sort, occasion: okazja })

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
            <ProductGridItem key={product.id} product={product} path="products" />
          ))}
        </Grid>
      ) : null}
    </div>
  )
}
