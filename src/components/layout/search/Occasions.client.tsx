'use client'
import React, { useCallback, useMemo } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Occasion } from '@/payload-types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  occasion: Occasion
}

export const OccasionItem: React.FC<Props> = ({ occasion }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = useMemo(() => {
    return searchParams.getAll('okazja').includes(String(occasion.id))
  }, [occasion.id, searchParams])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (isActive) {
      params.delete('okazja', String(occasion.id))
    } else {
      params.append('okazja', String(occasion.id))
    }

    const newParams = params.toString()

    router.push(pathname + '?' + newParams)
  }, [occasion.id, isActive, pathname, router, searchParams])

  return (
    <Label htmlFor={`okazja-${occasion.id}`} className="font-sans text-primary">
      <Checkbox id={`okazja-${occasion.id}`} onCheckedChange={setQuery} checked={isActive} />
      {occasion.name}
    </Label>
  )
}
