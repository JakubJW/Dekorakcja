import configPromise from '@payload-config'
import clsx from 'clsx'
import { getPayload } from 'payload'
import { Suspense } from 'react'

import { OccasionItem } from './Occasions.client'

async function OccasionList() {
  const payload = await getPayload({ config: configPromise })

  const occasions = await payload.find({
    collection: 'occasions',
    sort: 'name',
  })

  return (
    <div>
      <h3 className="mb-4 text-primary">Okazja</h3>
      <ul className="space-y-2">
        {occasions.docs.map((occasion) => {
          return (
            <li key={occasion.id}>
              <OccasionItem occasion={occasion} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded'
const activeAndTitles = 'bg-neutral-800'
const items = 'bg-neutral-400'

export function Occasions() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <OccasionList />
    </Suspense>
  )
}
