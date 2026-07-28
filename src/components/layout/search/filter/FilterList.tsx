'use client'

import type { SortFilterItem } from '@/lib/constants'
import { ArrowUpDown } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FilterItem } from './FilterItem'

export type ListItem = PathFilterItem | SortFilterItem
export type PathFilterItem = { path: string; title: string }

export function FilterList({ list }: { list: ListItem[] }) {
  const [active, setActive] = useState('')
  const [openSelect, setOpenSelect] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false)
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug)
      ) {
        setActive(listItem.title)
      }
    })
  }, [pathname, list, searchParams])

  return (
    <div className="relative flex-1" ref={ref}>
      <div
        className="flex justify-between cursor-pointer items-center gap-2 border rounded-full px-4 py-2 text-sm"
        onClick={() => {
          setOpenSelect(!openSelect)
        }}
      >
        <div>{active}</div>
        <ArrowUpDown className="size-4" />
      </div>
      {openSelect && (
        <div
          className="absolute z-40 w-full min-w-min rounded-md bg-white p-4 shadow-md"
          onClick={() => {
            setOpenSelect(false)
          }}
        >
          <nav>
            <ul>
              {list.map((item: ListItem, i) => (
                <FilterItem item={item} key={i} />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
