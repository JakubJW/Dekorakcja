'use client'

import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import React, { useMemo } from 'react'

type Props = {
  className?: string
  currencyCodeClassName?: string
  as?: 'span' | 'p'
  amount: number
  currencyCode?: string
}

export const Price = ({
  amount,
  className,
  currencyCode: currencyCodeFromProps,
  as = 'p',
}: Props & React.ComponentProps<'p'>) => {
  const { formatCurrency, supportedCurrencies } = useCurrency()

  const Element = as

  const currencyToUse = useMemo(() => {
    if (currencyCodeFromProps) {
      return supportedCurrencies.find((currency) => currency.code === currencyCodeFromProps)
    }
    return undefined
  }, [currencyCodeFromProps, supportedCurrencies])

  if (typeof amount === 'number') {
    return (
      <Element className={className} suppressHydrationWarning>
        {formatCurrency(amount, { currency: currencyToUse, locale: 'PL-pl' })}
      </Element>
    )
  }

  return null
}
