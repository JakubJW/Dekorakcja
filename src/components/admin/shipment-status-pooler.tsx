'use client'

import { Pill } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ShipmentStatusPoller() {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 3000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <Pill rounded size="small" pillStyle="warning">
      Oczekiwanie na potwierdzenie
    </Pill>
  )
}
