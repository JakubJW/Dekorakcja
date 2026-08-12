'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePaymentData } from '../PaymentDataProvider'

export const EmailField: React.FC = () => {
  const {
    personalData: { email, setEmail },
  } = usePaymentData()

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
