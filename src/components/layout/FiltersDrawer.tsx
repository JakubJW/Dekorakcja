'use client'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Funnel } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

export const MobileFiltersDrawer = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <>{children}</>
  }

  return (
    <Sheet>
      <SheetTrigger className="flex-1 h-10">
        <div className="flex gap-2 justify-between px-4 py-2 items-center border rounded-full text-sm">
          Filtrowanie <Funnel className="size-4" />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtrowanie</SheetTitle>
        </SheetHeader>
        <div className="px-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
