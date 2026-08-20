'use client'

import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { User } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'

export const AccountButton = () => {
  const { user } = useAuth()

  return (
    <Link
      href={user ? '/konto' : '/logowanie'}
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
    >
      <User className="size-5" />
    </Link>
  )
}
