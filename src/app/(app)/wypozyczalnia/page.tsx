import { Grid } from '@/components/Grid'
import { Categories } from '@/components/layout/search/Categories'
import { FilterList } from '@/components/layout/search/filter/FilterList'
import { Search } from '@/components/Search'
import { RentablesList } from '@/features/rent/components/rentables-list'
import { sorting } from '@/lib/constants'
import { SearchParams } from '@/shared/types'
import { Suspense } from 'react'

export const metadata = {
  description: 'Search for rentables in the store.',
  title: 'Wypozyczalnia',
}

export default function RentablesPage({ searchParams }: SearchParams) {
  return (
    <section className="py-16">
      <div className="container flex flex-col gap-4 md:gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <hgroup className="mb-4">
            <h1 className="text-4xl font-medium mb-2">Wypożyczalnia</h1>
            <p className="text-sm">Wypożycz sobie cos fajnego na sluba</p>
          </hgroup>
          <Suspense fallback={<div>wyszukiwarka</div>}>
            <Search path="/wypozyczalnia" />
          </Suspense>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-16 md:gap-4">
          <div className="w-full flex-none flex flex-col gap-4 md:gap-8 basis-1/5">
            <Suspense fallback={<div>filtry</div>}>
              <FilterList list={sorting} />
            </Suspense>
            <Suspense fallback={<div>kategorie</div>}>
              <Categories />
            </Suspense>
          </div>
          <Suspense
            fallback={
              <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-screen w-full">
                {Array(12)
                  .fill(0)
                  .map((_, index) => {
                    return <div className="animate-pulse bg-neutral-100 rounded-2xl" key={index} />
                  })}
              </Grid>
            }
          >
            <RentablesList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
