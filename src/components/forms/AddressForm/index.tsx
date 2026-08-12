import { usePaymentData } from '@/components/checkout/PaymentDataProvider'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useAuth } from '@/providers/Auth'
import {
  defaultCountries as supportedCountries,
  useAddresses,
} from '@payloadcms/plugin-ecommerce/client/react'
import { useImperativeHandle, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormError } from '../FormError'
import { FormItem } from '../FormItem'

export type AddressFormValues = {
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  country?: string
  postalCode?: string | null
  submitAddress: boolean
}

type Props = {
  existingAddressId?: Config['db']['defaultIDType']
  initialData?: Omit<Address, 'country' | 'id' | 'updatedAt' | 'createdAt'> & { country?: string }
  allowAddressSave?: boolean
}

export type FormHandle<T> = {
  submit: () => Promise<T | null>
}

export const AddressForm: React.FC<Props> = ({ existingAddressId, initialData }) => {
  const { user } = useAuth()
  const {
    personalData: { billingFormRef },
  } = usePaymentData()
  const { createAddress, updateAddress } = useAddresses()

  const values = useMemo<AddressFormValues>(
    () => ({
      ...initialData,
      submitAddress: false,
    }),
    [initialData],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AddressFormValues>({
    values,
  })

  useImperativeHandle(
    billingFormRef,
    () => ({
      submit: () =>
        new Promise((resolve) => {
          handleSubmit(
            (data) => {
              const shouldCreate = data.submitAddress && !existingAddressId
              const shouldUpdate = data.submitAddress && existingAddressId

              if (shouldCreate) {
                createAddress(data)
              } else if (shouldUpdate) {
                updateAddress(existingAddressId, data)
              }

              resolve(data)
            },
            () => resolve(null),
          )()
        }),
    }),
    [existingAddressId],
  )

  return (
    <form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <FormItem>
          <Label htmlFor="firstName">Imię*</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            {...register('firstName', { required: 'Imię jest wymagane.' })}
          />
          {errors.firstName && <FormError message={errors.firstName.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="lastName">Nazwisko*</Label>
          <Input
            autoComplete="family-name"
            id="lastName"
            {...register('lastName', { required: 'Nazwisko jest wymagane.' })}
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
            {...register('addressLine1', { required: 'Ulica jest wymagana.' })}
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
            {...register('city', { required: 'Miasto jest wymagane.' })}
          />
          {errors.city && <FormError message={errors.city.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="postalCode">Kod pocztowy*</Label>
          <Input
            id="postalCode"
            {...register('postalCode', { required: 'Kod pocztowy jest wymagany.' })}
          />
          {errors.postalCode && <FormError message={errors.postalCode.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="country">Kraj*</Label>
          <Controller
            name="country"
            control={control}
            rules={{ required: 'Kraj jest wymagany.' }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                required
                defaultValue={values.country ?? 'PL'}
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
            )}
          />

          {errors.country && <FormError message={errors.country.message} />}
        </FormItem>
        {user && (
          <Controller
            name="submitAddress"
            control={control}
            render={({ field }) => (
              <FormItem className="md:col-span-1 lg:col-span-2">
                <Label htmlFor="submitAddress">
                  <Checkbox
                    id="submitAddress"
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                  Zapisz adres na moim koncie
                </Label>
              </FormItem>
            )}
          />
        )}
      </div>
    </form>
  )
}
