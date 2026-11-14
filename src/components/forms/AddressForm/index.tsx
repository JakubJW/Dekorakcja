import { BillingAddressType } from '@/collections/plugin-ecommerce/transactions'
import { supportedCountries } from '@/collections/plugin-ecommerce/supported-countries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DomainAddress } from '@/features/addresses/domain/types'
import { cn } from '@/utilities/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormError } from '../FormError'
import { FormItem } from '../FormItem'
import {
  createAddressFormSchema,
  TCreateAddressFormSchema,
  TUpdateAddressFormSchema,
} from './billingAddressFormSchema'

type Props = {
  onSubmit: (values: TCreateAddressFormSchema | TUpdateAddressFormSchema) => void
  onCancel?: () => void
  initialData?: Partial<DomainAddress & { email?: string }>
  mode: 'create' | 'update'
  inputsContainerClassName?: string
  formClassName?: string
}

function toFormValues(initial: Partial<DomainAddress> | undefined): TCreateAddressFormSchema {
  const base = {
    email: initial?.email ?? '',
    addressLine1: initial?.addressLine1 ?? '',
    addressLine2: initial?.addressLine2,
    city: initial?.city ?? '',
    postalCode: initial?.postalCode ?? '',
    phone: initial?.phone ?? '',
    country: 'PL' as const,
  }

  if (initial?.kind === BillingAddressType.ORGANIZATION) {
    return {
      ...base,
      kind: BillingAddressType.ORGANIZATION,
      companyName: initial.companyName ?? '',
      taxId: initial.taxId ?? '',
      firstName: initial.firstName,
      lastName: initial.lastName,
    }
  }

  if (initial?.kind === BillingAddressType.PERSONAL) {
    return {
      ...base,
      kind: BillingAddressType.PERSONAL,
      firstName: initial.firstName ?? '',
      lastName: initial.lastName ?? '',
      companyName: initial.companyName,
      taxId: initial.taxId,
    }
  }

  return {
    ...base,
    kind: BillingAddressType.PERSONAL,
    firstName: '',
    lastName: '',
    companyName: undefined,
    taxId: undefined,
  }
}

export const AddressForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  mode,
  initialData,
  inputsContainerClassName,
  formClassName,
}) => {
  const form = useForm({
    resolver: zodResolver(createAddressFormSchema),
    values: toFormValues(initialData),
  })

  const [kind] = form.watch(['kind'])

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('flex flex-col grow', formClassName)}
    >
      {mode === 'create' && (
        <Controller
          name="kind"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mb-4">
              <RadioGroup
                className="flex gap-4"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="person" value="person" className="cursor-pointer" />
                  <Label htmlFor="person" className="cursor-pointer">
                    Osoba prywatna
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    id="organization"
                    value="organization"
                    className="cursor-pointer"
                  />
                  <Label htmlFor="organization" className="cursor-pointer">
                    Firma
                  </Label>
                </div>
              </RadioGroup>
              {form.formState.errors.kind && (
                <FormError message={form.formState.errors.kind.message} />
              )}
            </FormItem>
          )}
        />
      )}
      <div className={cn('grid grid-cols-1 gap-4 h-min', inputsContainerClassName)}>
        {kind === BillingAddressType.ORGANIZATION && (
          <React.Fragment>
            <FormItem>
              <Label htmlFor="taxId">NIP*</Label>
              <Input
                id="taxId"
                autoComplete="given-name"
                {...form.register('taxId', { required: 'NIP jest wymagany.' })}
              />
              {form.formState.errors.taxId && (
                <FormError message={form.formState.errors.taxId.message} />
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
        {kind === BillingAddressType.PERSONAL && (
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
        <FormItem>
          <Label htmlFor="phone">Nr telefonu</Label>
          <Input type="tel" id="phone" autoComplete="mobile tel" {...form.register('phone')} />
          {form.formState.errors.phone && (
            <FormError message={form.formState.errors.phone.message} />
          )}
        </FormItem>
        <FormItem>
          <Label htmlFor="email">Adres e-mail*</Label>
          <Input
            id="email"
            autoComplete="email"
            disabled={form.getValues('email') !== ''}
            {...form.register('email', { required: 'Adres e-mail jest wymagany.' })}
          />
          {form.formState.errors.email && (
            <FormError message={form.formState.errors.email.message} />
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
          <Label htmlFor="addressLine2">Numer lokalu</Label>
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
          <Controller
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label htmlFor={field.name}>Kraj*</Label>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCountries.map((country) => (
                      <SelectItem id={country.value} key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.country && (
                  <FormError message={form.formState.errors.country.message} />
                )}
              </FormItem>
            )}
          />
        </FormItem>
      </div>
      <div className="flex gap-4 mt-4">
        <Button type="submit" className="flex-1">
          Zatwierdź
        </Button>
        {onCancel && (
          <Button type="button" variant={'outline'} onClick={onCancel} className="flex-1">
            Anuluj
          </Button>
        )}
      </div>
    </form>
  )
}
