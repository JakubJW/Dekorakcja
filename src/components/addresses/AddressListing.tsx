import { supportedCountries } from '@/collections/plugin-ecommerce/supported-countries'
import { DomainAddress } from '@/features/addresses/domain/types'
import { Button } from '../ui/button'
import { Field, FieldContent, FieldLabel } from '../ui/field'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

type AddressListingProps = {
  options: DomainAddress[]
  selectedValue?: number
  onValueChange?: (value: string) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => Promise<void>
}

export const AddressListing = ({
  options,
  selectedValue,
  onValueChange,
  onEdit,
  onDelete,
}: AddressListingProps) => {
  if (!options || options.length === 0) {
    return <p>Nie znaleziono adresów.</p>
  }

  return (
    <RadioGroup
      defaultValue={String(selectedValue)}
      onValueChange={onValueChange}
      className="px-4 gap-4"
    >
      {options.map((address) => (
        <FieldLabel
          htmlFor={String(address.id)}
          key={address.id}
          className="has-data-[state=checked]:bg-white has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-white [&>[data-slot=field]]:p-6 has-[>[data-slot=field]]:rounded-lg"
        >
          <Field className="cursor-pointer">
            <FieldContent>
              <div>
                <div className="grow">
                  {address.firstName && address.lastName && (
                    <p className="font-medium mb-4">
                      {address.firstName} {address.lastName}
                    </p>
                  )}
                  {address.companyName && <p className="font-medium mb-4">{address.companyName}</p>}
                  <p className="font-light">
                    {address.addressLine1}
                    {address.addressLine2 && <>/{address.addressLine2}</>}
                  </p>
                  <p className="font-light">
                    {address.postalCode}&nbsp;{address.city}
                  </p>
                  <p className="font-light">
                    {
                      supportedCountries.filter((country) => country.value === address.country)[0]
                        .label
                    }
                  </p>
                  <p className="font-light">tel: {address.phone && <span>{address.phone}</span>}</p>
                  {address.taxId && <p className="font-light">NIP: {address.taxId}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={'link'}
                    className="p-0 underline"
                    onClick={() => onEdit(address.id!)}
                  >
                    Edytuj
                  </Button>
                  <Button
                    variant={'link'}
                    className="p-0 underline"
                    onClick={() => onDelete(address.id!)}
                  >
                    Usuń
                  </Button>
                </div>
              </div>
            </FieldContent>
            <RadioGroupItem value={String(address.id)} id={String(address.id)} className="hidden" />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
}
