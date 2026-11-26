import { useMask as useMaskVanilla } from '@react-input/mask'
import { useMemo } from 'react'

export type Props = {
  mask: string
}

export const useMask = ({ mask }: Props) => {
  const options = useMemo(
    () => ({
      mask,
      replacement: { _: /\d/ },
    }),
    [mask],
  )

  const inputRef = useMaskVanilla(options)

  const hasEmptyMask = mask.split('').every((char) => {
    return char === '_'
  })

  return { options, inputRef, hasEmptyMask }
}
