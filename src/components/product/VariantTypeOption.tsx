import { VariantOption } from '@/payload-types'
import { useProduct } from '@/providers/ProductProvider'
import { createUrl } from '@/utilities/createUrl'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'

type Props = {
  option: VariantOption
  variantTypeName: string
}

export const VariantTypeOption = ({ option, variantTypeName }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { selectedVariant, selectedOptions } = useProduct()
  const optionID = option.id

  // Base option params on current params so we can preserve any other param state in the url.
  const optionSearchParams = new URLSearchParams(searchParams.toString())

  // Update the option params using the current option to reflect how the url *would* change,
  // if the option was clicked.
  optionSearchParams.set(variantTypeName, String(optionID))

  let isAvailableForSale = true

  if (selectedVariant) {
    // If we found a matching variant, set the variant ID in the search params.
    optionSearchParams.set('variant', String(selectedVariant.id))

    if (!selectedVariant.useInventory) {
      isAvailableForSale = true
    } else if (selectedVariant.inventory && selectedVariant.inventory > 0) {
      isAvailableForSale = true
    } else {
      isAvailableForSale = false
    }
  }

  const optionUrl = createUrl(pathname, optionSearchParams)

  // The option is active if it's in the url params.
  const isActive =
    Boolean(isAvailableForSale) &&
    selectedOptions &&
    selectedOptions[variantTypeName] === String(optionID)

  return (
    <Button
      key={option.id}
      title={`${option.label} ${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
      variant={'ghost'}
      aria-disabled={!isAvailableForSale}
      disabled={!isAvailableForSale}
      className={clsx('px-2', {
        'bg-primary/5 text-primary': isActive,
      })}
      onClick={() => {
        router.replace(`${optionUrl}`, {
          scroll: false,
        })
      }}
    >
      {option.label}
    </Button>
  )
}
