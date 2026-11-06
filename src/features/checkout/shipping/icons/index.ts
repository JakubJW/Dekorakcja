import InpostCourierSvg from '@/assets/inpost-kurier-wide.svg'
import InpostParcelLockerSvg from '@/assets/inpost-paczkomat-wide.svg'
import type { FC, SVGProps } from 'react'

type IconComponent = FC<SVGProps<SVGSVGElement>>

export const DELIVERY_ICONS: Record<string, IconComponent> = {
  'paczkomat-inpost': InpostParcelLockerSvg,
  'kurier-inpost': InpostCourierSvg,
}
