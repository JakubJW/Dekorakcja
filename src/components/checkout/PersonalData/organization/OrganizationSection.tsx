import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useCheckoutData } from '../../CheckoutDataProvider'
import { OrganizationForm } from './OrganizationForm'

export const OrganizationSection = () => {
  const {
    personalData: { buyAsOrganization, setBuyAsOrganization, organizationAddress },
  } = useCheckoutData()

  return (
    <div>
      <div className="flex gap-4 items-center">
        <Label htmlFor="buyAsCompany">
          <Checkbox
            id="buyAsCompany"
            checked={buyAsOrganization}
            onCheckedChange={(state) => {
              setBuyAsOrganization(state as boolean)
            }}
          />
          Kupuję jako firma
        </Label>
      </div>
      {buyAsOrganization && <OrganizationForm initialData={organizationAddress} />}
    </div>
  )
}
