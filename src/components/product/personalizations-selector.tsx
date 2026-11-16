import { ProductPersonalizationOption } from '@/payload-types'
import { useProduct } from '@/providers/ProductProvider'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

type PersonalizationsSelectorProps = {
  options: ProductPersonalizationOption[]
}

export const PersonalizationsSelector = ({ options }: PersonalizationsSelectorProps) => {
  const [value, setValue] = useState('')
  const { customizations, setCustomizations } = useProduct()

  if (!options.length) {
    return null
  }

  return (
    <div>
      <dt className="mb-4 text-sm">{options[0].name}</dt>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          onClick={() => {
            setCustomizations((prev) => ({ ...prev, id: options[0].id, value }))
            setValue('')
          }}
        >
          Zapisz
        </Button>
      </div>
      {customizations && <p className="text-sm mt-4">Wybrany tekst: "{customizations.value}"</p>}
    </div>
  )
}
