import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { SearchParams } from '@/shared/types'
import { getRentablesList } from '../queries'

export const RentablesList = async ({ searchParams }: SearchParams) => {
  const { searchValue, sort, kategoria } = await searchParams
  const rentables = await getRentablesList({ searchValue, sort, category: kategoria })
  const resultsText = rentables.length > 1 ? 'wyników' : 'wynik'

  return (
    <div className="min-h-screen w-full">
      <div>
        {searchValue ? (
          <p className="mb-4">
            {rentables.length === 0
              ? 'Zadne produkty nie spelniaja kryteriow wyszukiwania '
              : `Pokazuję ${rentables.length} ${resultsText} dla `}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        ) : null}

        {!searchValue && rentables?.length === 0 && (
          <p className="mb-4">Nie znaleziono zadnych produktow. Podaj inne filtry.</p>
        )}

        {rentables?.length > 0 ? (
          <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentables.map((rentable) => {
              return <ProductGridItem key={rentable.id} product={rentable} path="wypozyczalnia" />
            })}
          </Grid>
        ) : null}
      </div>
    </div>
  )
}
