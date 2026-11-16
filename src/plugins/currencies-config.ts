import { CurrenciesConfig } from '@payloadcms/plugin-ecommerce/types'

export const currenciesConfig: CurrenciesConfig = {
  defaultCurrency: 'PLN',
  supportedCurrencies: [
    {
      code: 'PLN',
      label: 'PLN',
      symbol: 'zł',
      decimals: 2,
    },
  ],
}
