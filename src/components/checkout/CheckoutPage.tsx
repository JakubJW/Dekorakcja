'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { DomainAddress } from '@/features/addresses/domain/types'
import { useCustomCart } from '@/features/cart/use-cart'
import { getStripePromise } from '@/lib/stripe'
import { ShippingMethod } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { CartItems } from './CartItems'
import { LoginPrompt } from './login-prompt'
import { Addresses } from './steps/addresses'
import { PaymentDialog } from './steps/payment-dialog'
import { Locker, Shipping } from './steps/shipping'

type CheckoutPageProps = {
  addresses: DomainAddress[]
  shippingMethods: ShippingMethod[]
}

export const CheckoutPage = ({ addresses, shippingMethods }: CheckoutPageProps) => {
  const [shippingAddress, setShippingAddress] = useState<DomainAddress | undefined>()

  const [billingAddress, setBillingAddress] = useState<DomainAddress | undefined>()
  const [isDifferentBilling, setIsDifferentBilling] = useState(false)

  const [paymentData, setPaymentData] = useState<Record<string, unknown> | undefined>()
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { cart, updateShipping, refreshCart } = useCustomCart()
  const { user } = useAuth()
  const { initiatePayment } = usePayments()

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  useEffect(() => {
    if (!shippingAddress && addresses.length) {
      setShippingAddress(addresses[0])
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setIsDifferentBilling(true)
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => getStripePromise(), 1000)
    return () => clearTimeout(id)
  })

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            billingAddress: billingAddress ?? shippingAddress,
            currency: 'PLN',
            shippingAddress,
          },
        })) as Record<string, unknown>

        if (paymentData) {
          setPaymentData(paymentData)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = 'An error occurred while initiating payment.'

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'One or more items in your cart are out of stock.'
        }

        // setError(errorMessage)
        // toast.error(errorMessage)
      }
    },
    [billingAddress, shippingAddress, cart],
  )

  const onDialogOpenChange = (state: boolean) => {
    if (!state) {
      setPaymentData(undefined)
      setDialogOpen(false)
    }
  }

  const handleInitiatePaymentIntent = async () => {
    setIsLoading(true)
    await initiatePaymentIntent('stripe')
    setIsLoading(false)
    setDialogOpen(true)
  }

  const handleDeliveryMethodChange = useCallback(
    async (value: number) => {
      try {
        await updateShipping({ methodId: value })
        await refreshCart()
      } catch (error) {
        toast('błąd')
      }
    },
    [updateShipping],
  )

  const handleLockerChange = useCallback(
    async (value: Locker) => {
      try {
        await updateShipping({ methodId: undefined, lockerData: value })
        await refreshCart()
      } catch (error) {
        toast('błąd')
      }
    },
    [updateShipping],
  )

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose text-center max-w-none self-center mb-8">
          <p>Przetwarzanie płatności...</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="prose py-12 w-full items-center">
        <p>Twój koszyk jest pusty.</p>
        <Link href="/search">Kontynuuj zakupy</Link>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col mb-16">
      <div className="md:border rounded-xl flex flex-col md:flex-row grow items-stretch justify-stretch mt-16">
        <div className="basis-full lg:basis-2/3 md:p-8 space-y-10">
          <Suspense fallback={<div>pizda</div>}>
            {!user && <LoginPrompt />}
            <Addresses
              addresses={addresses}
              shippingAddress={shippingAddress}
              onShippingAddressChange={setShippingAddress}
              billingAddress={billingAddress}
              onBillingAddressChange={setBillingAddress}
              isDifferentBilling={isDifferentBilling}
              onIsDifferentBillingChange={setIsDifferentBilling}
            />
            <Separator />
            <Shipping
              options={shippingMethods}
              selectedOption={
                cart.shippingMethod !== undefined && typeof cart.shippingMethod === 'object'
                  ? cart.shippingMethod?.id
                  : undefined
              }
              lockerDetails={cart.lockerData as Locker}
              onDeliveryMethodChange={handleDeliveryMethodChange}
              onLockerChange={handleLockerChange}
            />
            <Button
              disabled={
                !cart.shippingMethod ||
                isLoading ||
                !shippingAddress ||
                (isDifferentBilling && !billingAddress)
              }
              className="self-start"
              onClick={async () => {
                await handleInitiatePaymentIntent()
              }}
            >
              {isLoading && <Loader2 className="animate-spin" />}
              Przejdź do płatności
            </Button>
            <PaymentDialog
              billingAddress={billingAddress}
              onProcessingPaymentChange={setProcessingPayment}
              paymentData={paymentData}
              dialogOpen={dialogOpen}
              onOpenChange={onDialogOpenChange}
            />
          </Suspense>
        </div>
        <CartItems shippingMethod={(cart.shippingMethod as ShippingMethod) ?? undefined} />
      </div>
    </div>
  )
}
