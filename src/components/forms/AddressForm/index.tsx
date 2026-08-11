import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Address, Config } from '@/payload-types'
import {
  defaultCountries as supportedCountries,
  useAddresses,
} from '@payloadcms/plugin-ecommerce/client/react'
import { deepMergeSimple } from 'payload/shared'
import { Ref, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../FormError'
import { FormItem } from '../FormItem'

type AddressFormValues = {
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  country: string
  postalCode?: string | null
}

type Props = {
  addressID?: Config['db']['defaultIDType']
  initialData?: Omit<Address, 'country' | 'id' | 'updatedAt' | 'createdAt'> & { country?: string }
  callback?: (data: Partial<Address>) => void
  skipSubmission?: boolean
  formRef?: Ref<HTMLFormElement>
}

export const AddressForm: React.FC<Props> = ({
  addressID,
  initialData,
  callback,
  skipSubmission,
  formRef,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormValues>({
    defaultValues: initialData,
  })

  const { createAddress, updateAddress } = useAddresses()

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      const newData = deepMergeSimple(initialData || {}, data)

      if (!skipSubmission) {
        if (!addressID) {
          return await createAddress(newData)
        }

        return await updateAddress(addressID, newData)
      }

      if (callback) {
        callback(newData)
      }
    },
    [initialData, skipSubmission, callback, addressID, updateAddress, createAddress],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <FormItem>
          <Label htmlFor="firstName">Imię*</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            {...register('firstName', { required: 'First name is required.' })}
          />
          {errors.firstName && <FormError message={errors.firstName.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="lastName">Nazwisko*</Label>
          <Input
            autoComplete="family-name"
            id="lastName"
            {...register('lastName', { required: 'Last name is required.' })}
          />
          {errors.lastName && <FormError message={errors.lastName.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="phone">Nr telefonu</Label>
          <Input type="tel" id="phone" autoComplete="mobile tel" {...register('phone')} />
          {errors.phone && <FormError message={errors.phone.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="addressLine1">Ulica*</Label>
          <Input
            id="addressLine1"
            autoComplete="address-line1"
            {...register('addressLine1', { required: 'Ulica is required.' })}
          />
          {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="addressLine2">Nr domu/mieszkania</Label>
          <Input id="addressLine2" autoComplete="address-line2" {...register('addressLine2')} />
          {errors.addressLine2 && <FormError message={errors.addressLine2.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="city">Miasto*</Label>
          <Input
            id="city"
            autoComplete="address-level2"
            {...register('city', { required: 'City is required.' })}
          />
          {errors.city && <FormError message={errors.city.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="postalCode">Kod pocztowy*</Label>
          <Input
            id="postalCode"
            {...register('postalCode', { required: 'Postal code is required.' })}
          />
          {errors.postalCode && <FormError message={errors.postalCode.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="country">Kraj*</Label>
          <Select
            {...register('country', {
              required: 'Country is required.',
            })}
            onValueChange={(value) => {
              setValue('country', value, { shouldValidate: true })
            }}
            required
            defaultValue={initialData?.country || ''}
          >
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Wybierz kraj" />
            </SelectTrigger>
            <SelectContent>
              {supportedCountries.map((country) => {
                const value = typeof country === 'string' ? country : country.value
                const label =
                  typeof country === 'string'
                    ? country
                    : typeof country.label === 'string'
                      ? country.label
                      : value

                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {errors.country && <FormError message={errors.country.message} />}
        </FormItem>
      </div>
    </form>
  )
}
