import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { useInquiry } from '../hooks/use-inquiry'

type Props = { rentalCartId: number; customerId?: number }

const createInquiryFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  additionalInfo: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  postalCode: z.string(),
})

export const InquiryForm = ({ rentalCartId, customerId }: Props) => {
  const { createInquiry } = useInquiry()
  const form = useForm({ resolver: zodResolver(createInquiryFormSchema) })

  const handleCreateInquiry = async () => {
    const res = await createInquiry({
      rentalCartId,
      customerId,
    })

    toast('Wysłano zapytanie')
  }

  return (
    <form>
      <h2>Dane kontaktowe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <FormItem>
          <Label htmlFor="firstName">Dodatkowe informacje*</Label>
          <Input
            id="firstName"
            {...form.register('firstName', { required: 'Dodatkowe informajce są wymagane.' })}
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
          <Label htmlFor="email">Adres email</Label>
          <Input type="email" id="email" autoComplete="email" {...form.register('email')} />
          {form.formState.errors.phone && (
            <FormError message={form.formState.errors.email?.message} />
          )}
        </FormItem>
        <h2 className="col-span-2">Miejsce i termin uroczystości</h2>

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
      </div>

      <h2>Treść zapytania</h2>
      <FormItem>
        <Label htmlFor="additionalInfo">
          Dodatkowe informacje (np. ilość poszczególnych przedmiotów)*
        </Label>
        <Textarea
          id="additionalInfo"
          {...form.register('additionalInfo', { required: 'Kod pocztowy jest wymagany.' })}
        />
        {form.formState.errors.additionalInfo && (
          <FormError message={form.formState.errors.additionalInfo.message} />
        )}
      </FormItem>
      <Button onClick={form.handleSubmit(handleCreateInquiry)}>Wyślij zapytanie</Button>
    </form>
  )
}
