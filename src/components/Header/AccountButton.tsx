'use client'

import { useAuth } from '@/providers/Auth'
import { User } from 'lucide-react'
import Link from 'next/link'

export const AccountButton = () => {
  const { user } = useAuth()

  return (
    <>
      {user ? (
        <Link href="/account">
          <User className="size-4" />
        </Link>
      ) : (
        <p>nie ma usera</p>
      )}
    </>
  )
}
