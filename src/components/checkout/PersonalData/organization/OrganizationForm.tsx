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
import { OrganizationAddress } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { defaultCountries as supportedCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { Info } from 'lucide-react'
import { useImperativeHandle, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useCheckoutData } from '../../CheckoutDataProvider'

export type CompanyFormValues = {
  nip?: string | null
  organization?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  country?: string
  postalCode?: string | null
  submitOrganizationAddress: boolean
}

type Props = {
  initialData?: Omit<
    OrganizationAddress,
    'country' | 'id' | 'updatedAt' | 'createdAt' | 'customer'
  > & {
    country?: string
  }
}

export const OrganizationForm: React.FC<Props> = ({ initialData }) => {
  const { user } = useAuth()

  const values = useMemo<CompanyFormValues>(
    () => ({
      ...initialData,
      submitOrganizationAddress: false,
    }),
    [initialData],
  )

  const {
    personalData: { companyFormRef },
  } = useCheckoutData()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CompanyFormValues>({
    defaultValues: initialData,
  })

  useImperativeHandle(companyFormRef, () => ({
    submit: () =>
      new Promise((resolve) => {
        handleSubmit(
          (data) => resolve(data),
          () => resolve(null),
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
              {...register('nip', { required: 'NIP jest wymagany.' })}
            />
            {errors.nip && <FormError message={errors.nip.message} />}
          </FormItem>
          <FormItem>
            <Label htmlFor="organization">Nazwa firmy*</Label>
            <Input
              autoComplete="company"
              id="organization"
              {...register('organization', { required: 'Last name is required.' })}
            />
            {errors.organization && <FormError message={errors.organization.message} />}
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
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="country">Kraj*</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  required
                  defaultValue={values.country ?? 'PL'}
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
                {errors.country && <FormError message={errors.country.message} />}
              </FormItem>
            )}
          />
        </div>
        {user && (
          <FormItem>
            <Label htmlFor="submitOrganizationAddress">
              <Checkbox id="submitOrganizationAddress" {...register('submitOrganizationAddress')} />
              Zapisz adres na moim koncie
            </Label>
          </FormItem>
        )}
      </form>
    </div>
  )
}
