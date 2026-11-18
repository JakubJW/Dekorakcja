import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import Stripe from 'stripe'

interface StripeProps {
  secretKey: string
  apiVersion?: string
  appInfo?: Stripe.AppInfo
}

export const initiatePayment =
  (props: StripeProps): NonNullable<PaymentAdapter['initiatePayment']> =>
  async ({ data, req, transactionsSlug }) => {
    const { payload } = req
    const { apiVersion, appInfo, secretKey } = props || {}
    const { cart: defaultCart, currency, billingAddress, shippingAddress } = data

    if (!secretKey) {
      throw new Error('Stripe secret key is required.')
    }
    if (!currency) {
      throw new Error('Currency is required.')
    }
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
      let customer = (
        await stripe.customers.list({
          email: shippingAddress.email,
        })
      ).data[0]
      if (!customer?.id) {
        customer = await stripe.customers.create({
          email: shippingAddress.email,
        })
      }
      const flattenedCart = cart.items.map((item) => {
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
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          address: {
            city: shippingAddress.city,
            country: shippingAddress.country,
            line1: shippingAddress.addressLine1,
            line2: shippingAddress.addressLine2 ?? undefined,
            postal_code: shippingAddress.postalCode,
          },
          carrier: typeof cart.shippingMethod === 'object' ? cart.shippingMethod?.name : undefined,
        },
        metadata: {
          cartID: cart.id,
          cartItemsSnapshot: JSON.stringify(flattenedCart),
        },
      })
      // Create a transaction for the payment intent in the database
      const transaction = await payload.create({
        collection: transactionsSlug as 'transactions',
        data: {
          ...(req.user
            ? {
                customer: req.user.id,
              }
            : {
                customerEmail: billingAddress.email,
              }),
          amount: paymentIntent.amount,
          billingAddress: billingAddress,
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
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
          },
        },
        req,
      })
      const returnData = {
        clientSecret: paymentIntent.client_secret || '',
        message: 'Payment initiated successfully',
        paymentIntentID: paymentIntent.id,
      }
      return returnData
    } catch (error) {
      payload.logger.error({
        err: error,
        msg: 'Error initiating payment with Stripe',
      })
      throw new Error(error instanceof Error ? error.message : 'Unknown error initiating payment')
    }
  }
