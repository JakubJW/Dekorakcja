import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import Stripe from 'stripe'
import { initiatePaymentDataSchema } from './schemas'

interface StripeProps {
  secretKey: string
  apiVersion?: string
  appInfo?: Stripe.AppInfo
}

export const initiatePayment =
  ({
    apiVersion,
    appInfo,
    secretKey,
  }: StripeProps): NonNullable<PaymentAdapter['initiatePayment']> =>
  async ({ data, req }) => {
    const { payload } = req
    const { cart: defaultCart, currency, billingAddress, shippingAddress } = data

    if (!secretKey) {
      throw new Error('Stripe secret key is required.')
    }

    const validated = initiatePaymentDataSchema.parse({
      currency,
      billingAddress,
      shippingAddress,
    })

    if (!defaultCart || !defaultCart.items || defaultCart.items.length === 0) {
      throw new Error('Cart is empty or not provided.')
    }

    // nie uzywamy przychodzącego cart, poniewaz nie uwzglenia on zadnych dodanych do koszyka pól np. total, shippingMethod
    // pobieramy koszyk od nowa i wiemy ze items i variants oraz ich subtotal są zwalidowane - reszta lezy po naszej stronie
    const cart = await payload.findByID({ collection: 'carts', id: defaultCart.id, depth: 2, req })

    if (!cart) {
      throw new Error('Cart not found')
    }

    let amount = cart.total

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new Error('A valid amount is required to initiate a payment.')
    }
    const stripe = new Stripe(secretKey, {
      // API version can only be the latest, stripe recommends ts ignoring it
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - ignoring since possible versions are not type safe, only the latest version is recognised
      apiVersion: apiVersion || '2025-06-30.preview',
      appInfo: appInfo || {
        name: 'Stripe Payload Plugin',
        url: 'https://payloadcms.com',
      },
    })

    try {
      let [customer] = (
        await stripe.customers.list({
          email: validated.shippingAddress.email,
        })
      ).data

      if (!customer) {
        customer = await stripe.customers.create({
          email: validated.shippingAddress.email,
        })
      }

      //@ts-ignore
      const flattenedCart = cart.items.map((item) => {
        //@ts-ignore
        const productID = typeof item.product === 'object' ? item.product.id : item.product
        const variantID = item.variant
          ? typeof item.variant === 'object'
            ? item.variant.id
            : item.variant
          : undefined
        // Preserve any additional custom properties (e.g., deliveryOption, customizations)
        // that may have been added via cartItemMatcher
        const { id: _id, product: _product, variant: _variant, ...customProperties } = item
        return {
          ...customProperties,
          product: productID,
          quantity: item.quantity,
          ...(variantID
            ? {
                variant: variantID,
              }
            : {}),
        }
      })

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        automatic_payment_methods: {
          enabled: true,
        },
        currency,
        customer: customer.id,
        shipping: {
          name: `${validated.shippingAddress.firstName} ${validated.shippingAddress.lastName}`,
          address: {
            city: validated.shippingAddress.city,
            country: validated.shippingAddress.country,
            line1: validated.shippingAddress.addressLine1,
            line2: validated.shippingAddress.addressLine2,
            postal_code: validated.shippingAddress.postalCode,
          },
          carrier: typeof cart.shippingMethod === 'object' ? cart.shippingMethod?.name : undefined,
        },
        metadata: {
          cartID: cart.id,
          cartItemsSnapshot: JSON.stringify(flattenedCart),
        },
      })

      await payload.create({
        collection: 'transactions',
        req,
        data: {
          ...(req.user
            ? {
                customer: req.user.id,
              }
            : {
                customerEmail: validated.billingAddress.email,
              }),
          amount: paymentIntent.amount,
          billingAddress: validated.billingAddress,
          cart: cart.id,
          currency: paymentIntent.currency.toUpperCase() as 'PLN',
          items: flattenedCart,
          paymentMethod: 'stripe',
          status: 'pending',
          stripe: {
            customerID: customer.id,
            paymentIntentID: paymentIntent.id,
          },
          checkoutData: {
            shippingAddress: validated.shippingAddress,
          },
        },
      })

      return {
        clientSecret: paymentIntent.client_secret || '',
        message: 'Payment initiated successfully',
        paymentIntentID: paymentIntent.id,
      }
    } catch (error) {
      payload.logger.error({
        err: error,
        msg: 'Error initiating payment with Stripe',
      })
      throw new Error(error instanceof Error ? error.message : 'Unknown error initiating payment')
    }
  }
