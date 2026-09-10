'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
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
import { DomainOrganizationAddress } from '@/features/addresses/domain/types'
import { useAuth } from '@/providers/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { defaultCountries as supportedCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { Info } from 'lucide-react'
import { useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useCheckoutData } from '../../CheckoutDataProvider'
import { createOrganizationAddressFormSchema } from './organizationAddressFormSchema'

type Props = {
  initialData?: DomainOrganizationAddress
}

export const OrganizationForm: React.FC<Props> = ({ initialData }) => {
  const { user } = useAuth()

  const {
    personalData: { companyFormRef },
  } = useCheckoutData()
  const form = useForm({
    resolver: zodResolver(createOrganizationAddressFormSchema),
    defaultValues: { ...initialData, submitOrganizationAddress: false },
  })

  const country = form.watch('country')

  useImperativeHandle(companyFormRef, () => ({
    submit: () =>
      new Promise((resolve) => {
        form.handleSubmit(
          (data) => resolve(data),
          () => resolve(undefined),
        )()
      }),
  }))

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 rounded-md p-2 mb-4 bg-emerald-100 text-emerald-500">
        <Info className="size-4" />
        <p className="text-sm">
          nie jesteśmy czynnym płatnikiem vatu i fv jest netto równa sie brutto
        </p>
      </div>
      <form>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <FormItem>
            <Label htmlFor="NIP">NIP*</Label>
            <Input
              id="NIP"
              autoComplete="given-name"
              {...form.register('nip', { required: 'NIP jest wymagany.' })}
            />
            {form.formState.errors.nip && <FormError message={form.formState.errors.nip.message} />}
          </FormItem>
          <FormItem>
            <Label htmlFor="organization">Nazwa firmy*</Label>
            <Input
              autoComplete="company"
              id="organization"
              {...form.register('organization', { required: 'Last name is required.' })}
            />
            {form.formState.errors.organization && (
              <FormError message={form.formState.errors.organization.message} />
            )}
          </FormItem>
          <FormItem>
            <Label htmlFor="addressLine1">Ulica*</Label>
            <Input
              id="addressLine1"
              autoComplete="address-line1"
              {...form.register('addressLine1', { required: 'Ulica is required.' })}
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
              {...form.register('city', { required: 'City is required.' })}
            />
            {form.formState.errors.city && (
              <FormError message={form.formState.errors.city.message} />
            )}
          </FormItem>
          <FormItem>
            <Label htmlFor="postalCode">Kod pocztowy*</Label>
            <Input
              id="postalCode"
              {...form.register('postalCode', { required: 'Postal code is required.' })}
            />
            {form.formState.errors.postalCode && (
              <FormError message={form.formState.errors.postalCode.message} />
            )}
          </FormItem>
          <Controller
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="country">Kraj*</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  required
                  defaultValue={country ?? 'PL'}
                >
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Kraj" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCountries.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
        </div>
        {user && (
          <FormItem>
            <Label htmlFor="submitOrganizationAddress">
              <Checkbox
                id="submitOrganizationAddress"
                {...form.register('submitOrganizationAddress')}
              />
              Zapisz adres na moim koncie
            </Label>
          </FormItem>
        )}
      </form>
    </div>
  )
}
