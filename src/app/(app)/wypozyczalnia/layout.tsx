import { Categories } from '@/components/layout/search/Categories'
import { FilterList } from '@/components/layout/search/filter/FilterList'
import { Search } from '@/components/Search'
import { sorting } from '@/lib/constants'
import React, { Suspense } from 'react'

export default function RentablesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <section className="py-16">
        <div className="container flex flex-col gap-4 md:gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <hgroup className="mb-4">
              <h1 className="text-4xl font-medium mb-2">Wypozyczalnia</h1>
              <p className="text-sm">Wypozycz sobie cos fajnego na sluba</p>
            </hgroup>
            <Search />
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-16 md:gap-4">
            <div className="w-full flex-none flex flex-col gap-4 md:gap-8 basis-1/5">
              <FilterList list={sorting} />
              <Categories />
            </div>
            <div className="min-h-screen w-full">{children}</div>
          </div>
        </div>
      </section>
    </Suspense>
  )
}
