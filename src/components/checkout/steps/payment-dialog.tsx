import { CheckoutForm } from '@/components/forms/CheckoutForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cssVariables } from '@/cssVariables'
import { DomainAddress } from '@/features/addresses/domain/types'
import { getStripePromise } from '@/lib/stripe'
import { Elements } from '@stripe/react-stripe-js'
import { Dispatch, SetStateAction } from 'react'

type PaymentProps = {
  billingAddress?: DomainAddress
  paymentData: Record<string, unknown> | undefined
  onProcessingPaymentChange: Dispatch<SetStateAction<boolean>>
  dialogOpen: boolean
  onOpenChange: (state: boolean) => void
}

export const PaymentDialog = ({
  billingAddress,
  onProcessingPaymentChange,
  paymentData,
  dialogOpen,
  onOpenChange,
}: PaymentProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Płatność</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {paymentData && (
          <Elements
            stripe={getStripePromise()}
            options={{
              clientSecret: paymentData['clientSecret'] as string,
              appearance: {
                theme: 'stripe',
                variables: {
                  borderRadius: '10px',
                  colorPrimary: '#4a3728',
                  gridColumnSpacing: '20px',
                  gridRowSpacing: '20px',
                  colorBackground: cssVariables.colors.base0,
                  colorDanger: cssVariables.colors.error500,
                  colorDangerText: cssVariables.colors.error500,
                  colorIcon: cssVariables.colors.base1000,
                  colorText: cssVariables.colors.base1000,
                  colorTextPlaceholder: '#858585',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSizeBase: '16px',
                  fontWeightBold: '600',
                  fontWeightNormal: '500',
                  spacingUnit: '4px',
                },
              },
            }}
          >
            <CheckoutForm
              customerEmail={billingAddress?.email}
              billingAddress={billingAddress}
              setProcessingPayment={onProcessingPaymentChange}
              onCancel={() => {
                onOpenChange(false)
              }}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}
