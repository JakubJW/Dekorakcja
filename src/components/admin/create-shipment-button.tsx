'use client'
import { Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  orderId: string | number
}

export function CreateShipmentButton({ orderId }: Props) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreate = async () => {
    setIsGenerating(true)
    setActionError(null)
    try {
      const res = await fetch(`/api/orders/${orderId}/create-shipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Nie udało się utworzyć przesyłki')
      }

      router.refresh()
    } catch (err: any) {
      setActionError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {actionError && <div style={{ color: '#ef4444', fontSize: '12px' }}>{actionError}</div>}
      <Button onClick={handleCreate} disabled={isGenerating}>
        {isGenerating ? 'Ładowanie...' : 'Wygeneruj list przewozowy'}
      </Button>
    </>
  )
}
