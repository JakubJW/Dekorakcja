import { CollectionConfig } from 'payload'
import { BillingAddresses } from './billing-addresses'
import { Categories } from './categories'
import { Inquiries } from './inquiries'
import { Media } from './media'
import { Occasions } from './occasions'
import { Pages } from './pages'
import { RentCarts } from './rent-carts'
// import { RentCartsItems } from './rent-carts-items'
import { Invoices } from './invoices'
import { Rentables } from './rentables'
import { ShippingMethods } from './shipping-methods'
import { Users } from './users'

export const collections: CollectionConfig[] = [
  BillingAddresses,
  Categories,
  Inquiries,
  Media,
  Occasions,
  Pages,
  RentCarts,
  Rentables,
  ShippingMethods,
  Invoices,
  Users,
]
