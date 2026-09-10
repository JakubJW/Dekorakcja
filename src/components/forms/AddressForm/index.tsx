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
import { defaultCountries as supportedCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { FormError } from '../FormError'
import { FormItem } from '../FormItem'
import { TCreateAddressFormSchema, TUpdateAddressFormSchema } from './addressFormSchema'

type Props = {
  allowAddressSave?: boolean
  form: UseFormReturn<TCreateAddressFormSchema | TUpdateAddressFormSchema>
}

export type FormHandle<T> = {
  submit: () => Promise<T | undefined>
}

export const AddressForm: React.FC<Props> = ({ form, allowAddressSave }) => {
  const country = form.watch('country')

  return (
    <form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <FormItem>
          <Label htmlFor="firstName">Imię*</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            {...form.register('firstName', { required: 'Imię jest wymagane.' })}
          />
          {form.formState.errors.firstName && (
            <FormError message={form.formState.errors.firstName.message} />
          )}
        </FormItem>
        <FormItem>
          <Label htmlFor="lastName">Nazwisko*</Label>
          <Input
            autoComplete="family-name"
            id="lastName"
            {...form.register('lastName', { required: 'Nazwisko jest wymagane.' })}
          />
          {form.formState.errors.lastName && (
            <FormError message={form.formState.errors.lastName.message} />
          )}
        </FormItem>
        <FormItem>
          <Label htmlFor="phone">Nr telefonu</Label>
          <Input type="tel" id="phone" autoComplete="mobile tel" {...form.register('phone')} />
          {form.formState.errors.phone && (
            <FormError message={form.formState.errors.phone.message} />
          )}
        </FormItem>
        <FormItem>
          <Label htmlFor="addressLine1">Ulica*</Label>
          <Input
            id="addressLine1"
            autoComplete="address-line1"
            {...form.register('addressLine1', { required: 'Ulica jest wymagana.' })}
          />
          {form.formState.errors.addressLine1 && (
            <FormError message={form.formState.errors.addressLine1.message} />
          )}
        </FormItem>
        <FormItem>
          <Label htmlFor="addressLine2">Nr domu/mieszkania</Label>
          <Input
            id="addressLine2"
            autoComplete="address-line2"
            {...form.register('addressLine2')}
          />
          {form.formState.errors.addressLine2 && (
            <FormError message={form.formState.errors.addressLine2.message} />
          )}
        </FormItem>
        <FormItem>
          <Label htmlFor="city">Miasto*</Label>
          <Input
            id="city"
            autoComplete="address-level2"
            {...form.register('city', { required: 'Miasto jest wymagane.' })}
          />
          {form.formState.errors.city && <FormError message={form.formState.errors.city.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="postalCode">Kod pocztowy*</Label>
          <Input
            id="postalCode"
            {...form.register('postalCode', { required: 'Kod pocztowy jest wymagany.' })}
          />
          {form.formState.errors.postalCode && (
            <FormError message={form.formState.errors.postalCode.message} />
          )}
        </FormItem>
        <FormItem>
          <Label htmlFor="country">Kraj*</Label>
          <Controller
            name="country"
            control={form.control}
            rules={{ required: 'Kraj jest wymagany.' }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                required
                defaultValue={country ?? 'PL'}
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

          {form.formState.errors.country && (
            <FormError message={form.formState.errors.country.message} />
          )}
        </FormItem>
        {allowAddressSave && (
          <Controller
            name="submitAddress"
            control={form.control}
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
