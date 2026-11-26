import { format } from '@react-input/mask'
import { ChangeEvent, ComponentProps, FC, useCallback } from 'react'
import { Input } from '../ui/input'
import { useMask } from './use-mask'

type DefaultProps = ComponentProps<typeof Input>

export type Props = Omit<DefaultProps, 'onChange'> & {
  id: string
  mask?: string
  onChange: (value: string) => void
}

export const MaskInput: FC<Props> = ({ id, mask = '______________', onChange, value, ...rest }) => {
  const { options, hasEmptyMask, inputRef } = useMask({ mask })

  const formattedValue = format(value ? String(value) : '', options)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      console.log(event)
      onChange(format(event.target.value, options))
    },
    [onChange, options],
  )
  return (
    <Input
      {...rest}
      ref={inputRef}
      placeholder={hasEmptyMask ? '' : mask}
      id={id}
      type="tel"
      onChange={handleChange}
      value={formattedValue}
    />
  )
}
