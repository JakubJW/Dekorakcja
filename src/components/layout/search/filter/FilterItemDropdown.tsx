'use client'

import { ArrowUpDown } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { ListItem } from '.'

import { FilterItem } from './FilterItem'

export function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState('')
  const [openSelect, setOpenSelect] = useState(false)
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
    <div className="relative" ref={ref}>
      <div
        className="flex items-center justify-between border rounded-full px-4 py-2 text-sm"
        onClick={() => {
          setOpenSelect(!openSelect)
        }}
      >
        <ArrowUpDown className="size-4" />
        <div>{active}</div>
      </div>
      {openSelect && (
        <div
          className="absolute z-40 w-full rounded-md bg-white p-4 shadow-md"
          onClick={() => {
            setOpenSelect(false)
          }}
        >
          {list.map((item: ListItem, i) => (
            <FilterItem item={item} key={i} />
          ))}
        </div>
      )}
    </div>
  )
}
