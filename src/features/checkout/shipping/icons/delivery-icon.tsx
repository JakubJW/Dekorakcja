import type { SVGProps } from 'react'
import { DELIVERY_ICONS } from './index'

interface DeliveryIconProps extends SVGProps<SVGSVGElement> {
  name: string | undefined
}

export function DeliveryIcon({ name, ...props }: DeliveryIconProps) {
  if (!name || !(name in DELIVERY_ICONS)) return null

  const Icon = DELIVERY_ICONS[name]
  return <Icon aria-hidden focusable="false" {...props} />
}
