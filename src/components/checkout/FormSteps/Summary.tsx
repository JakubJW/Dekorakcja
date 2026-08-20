import { useCheckoutData } from '../CheckoutDataProvider'

export const Summary = () => {
  const {
    personalData: { billingAddress, companyData, email, buyAsCompany },
  } = useCheckoutData()

  return (
    <div className="space-y-2">
      {email && <p>E-mail: {email}</p>}
      <div>
        <p className="font-medium">Adres rozliczeniowy</p>
        <p>{billingAddress?.firstName}</p>
        <p>NIP: {billingAddress?.lastName}</p>
        <p>
          {billingAddress.addressLine1}
          {billingAddress.addressLine2 ? `, ${billingAddress.addressLine2}` : ''}
        </p>
        <p>
          {billingAddress.postalCode} {billingAddress.city}
        </p>
      </div>
      {buyAsCompany && companyData && (
        <div>
          <p className="font-medium">Dane firmy</p>
          <p>{companyData.companyName}</p>
          <p>NIP: {companyData.NIP}</p>
          <p>
            {companyData.addressLine1}
            {companyData.addressLine2 ? `, ${companyData.addressLine2}` : ''}
          </p>
          <p>
            {companyData.postalCode} {companyData.city}
          </p>
        </div>
      )}
    </div>
  )
}
