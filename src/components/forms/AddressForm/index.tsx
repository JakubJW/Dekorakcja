import { BillingAddressType } from '@/collections/billing-addresses'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { FormError } from '../FormError'
import { FormItem } from '../FormItem'
import {
  TCreateBillingAddressFormSchema,
  TUpdateBillingAddressFormSchema,
} from './billingAddressFormSchema'

type Props = {
  allowAddressSave?: boolean
  form: UseFormReturn<TCreateBillingAddressFormSchema | TUpdateBillingAddressFormSchema>
  onSubmit: (values: TCreateBillingAddressFormSchema) => void
}

export type FormHandle<T> = {
  submit: () => Promise<T | undefined>
}

export const AddressForm: React.FC<Props> = ({ form, allowAddressSave, onSubmit }) => {
  const type = form.watch('type')

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <Controller
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <Label htmlFor="type">
                <Checkbox
                  id="type"
                  checked={field.value === BillingAddressType.ORGANIZATION}
                  onCheckedChange={(checked) =>
                    checked
                      ? field.onChange(BillingAddressType.ORGANIZATION)
                      : field.onChange(BillingAddressType.PERSONAL)
                  }
                />
                Kupuję jako firma
              </Label>
            </FormItem>
          )}
        />
        {type === BillingAddressType.ORGANIZATION && (
          <div className="flex items-center gap-2 rounded-md p-2 mb-4 bg-emerald-100 text-emerald-500 col-span-full">
            <Info className="size-4" />
            <p className="text-sm">
              nie jesteśmy czynnym płatnikiem vatu i fv jest netto równa sie brutto
            </p>
          </div>
        )}
        {type === BillingAddressType.ORGANIZATION && (
          <React.Fragment>
            <FormItem>
              <Label htmlFor="NIP">NIP*</Label>
              <Input
                id="NIP"
                autoComplete="given-name"
                {...form.register('nip', { required: 'NIP jest wymagany.' })}
              />
              {form.formState.errors.nip && (
                <FormError message={form.formState.errors.nip.message} />
              )}
            </FormItem>
            <FormItem>
              <Label htmlFor="organization">Nazwa firmy*</Label>
              <Input
                autoComplete="company"
                id="organization"
                {...form.register('companyName', { required: 'Last name is required.' })}
              />
              {form.formState.errors.companyName && (
                <FormError message={form.formState.errors.companyName.message} />
              )}
            </FormItem>
          </React.Fragment>
        )}
        {type === BillingAddressType.PERSONAL && (
          <React.Fragment>
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
          </React.Fragment>
        )}
        {/* <FormItem>
          <Label htmlFor="phone">Nr telefonu</Label>
          <Input type="tel" id="phone" autoComplete="mobile tel" {...form.register('phone')} />
          {form.formState.errors.phone && (
            <FormError message={form.formState.errors.phone.message} />
          )}
        </FormItem> */}
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
        <Button className="self-end" type="submit">
          Przejdź do dostawy
        </Button>
      </div>
    </form>
  )
}
