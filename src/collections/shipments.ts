import type { CollectionConfig } from 'payload'

export const Shipments: CollectionConfig = {
  slug: 'shipments',
  labels: {
    singular: 'Przesyłka',
    plural: 'Przesyłki',
  },
  admin: {
    useAsTitle: 'trackingNumber',
    defaultColumns: ['order', 'provider', 'status', 'trackingNumber', 'createdAt'],
    group: 'Dostawy',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      // Opcjonalnie: pozwala na wiele przesyłek do jednego zamówienia
      hasMany: false,
    },
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'InPost', value: 'inpost' },
        { label: 'DHL', value: 'dhl' },
      ],
      required: true,
      defaultValue: 'inpost',
    },
    {
      name: 'providerShipmentId',
      type: 'text',
      required: true,
      admin: { description: 'ID przesyłki w systemie kuriera (np. InPost ID)', readOnly: true },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: { description: 'Numer śledzenia paczki', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Oczekująca', value: 'created' },
        { label: 'Potwierdzona', value: 'confirmed' },
        { label: 'W drodze', value: 'in_transit' },
        { label: 'Doręczona', value: 'delivered' },
        { label: 'Anulowana', value: 'cancelled' },
      ],
      defaultValue: 'created',
    },
    {
      name: 'label',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Etykieta nadawcza w formacie PDF', readOnly: true },
    },
    {
      name: 'isReturn',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Czy to przesyłka zwrotna?' },
    },
    {
      name: 'rawResponse',
      type: 'json',
      admin: {
        description: 'Pełna odpowiedź z API (do celów audytowych/debugowania)',
        disabled: true, // Ukryte w UI, żeby nie straszyło admina
      },
    },
  ],
}
