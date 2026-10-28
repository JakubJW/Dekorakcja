import { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  labels: { singular: 'Faktura', plural: 'Faktury' },
  admin: {
    group: 'Sklep',
    useAsTitle: 'invoiceNumber',
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Oczekuje na wystawienie', value: 'pending' },
        { label: 'W trakcie przetwarzania', value: 'processing' },
        { label: 'Wystawiona', value: 'success' },
        { label: 'Błąd (wymaga ręcznej akcji)', value: 'failed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'invoiceNumber',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'subiektId',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'issuedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'pdfUrl',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'retryCount',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'lastAttemptAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'lastError',
      type: 'textarea',
      admin: { readOnly: true },
    },
    {
      name: 'attemptsLog',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        { name: 'timestamp', type: 'date', required: true },
        { name: 'status', type: 'text', required: true },
        { name: 'message', type: 'textarea' },
        { name: 'responsePayload', type: 'json' },
      ],
    },
  ],
}
