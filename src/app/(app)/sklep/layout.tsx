import { FilterList } from '@/components/layout/search/filter'
import { Occasions } from '@/components/layout/search/Occasions'
import { Search } from '@/components/Search'
import { sorting } from '@/lib/constants'
import React, { Suspense } from 'react'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>pizda</div>}>
      <section className="py-16 bg-[#FEF8F6]">
        <div className="container flex flex-col gap-8 ">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <hgroup>
              <h1 className="text-4xl font-medium mb-2">Sklep</h1>
              <p className="text-sm">Elevate your celebration with our premium decor pieces.</p>
            </hgroup>
            <Search />
          </div>
          <div className="flex flex-col md:flex-row items-start justify-between gap-16 md:gap-4">
            <div className="w-full flex-none flex flex-col gap-4 md:gap-8 basis-1/5">
              <Occasions />
              <FilterList list={sorting} />
            </div>
            <div className="min-h-screen w-full">{children}</div>
          </div>
        </div>
      </section>
    </Suspense>
  )
}
