'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCheckoutData } from '../CheckoutDataProvider'

export const EmailField: React.FC = () => {
  const {
    personalData: { email, setEmail },
  } = useCheckoutData()

  return (
    <div className="space-y-2">
      <Label htmlFor="email">E-mail*</Label>
      <Input
        id="email"
        type="email"
        required
        value={email ?? ''}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  )
}
