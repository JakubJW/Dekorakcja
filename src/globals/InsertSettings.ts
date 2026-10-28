import { adminOnly } from '@/access/adminOnly'
import { GlobalConfig } from 'payload'

export const InsertSettings: GlobalConfig = {
  slug: 'insert-settings',
  label: 'Integracja InsERT',

  access: {
    read: adminOnly,
    update: adminOnly,
  },

  fields: [
    {
      name: 'authStatusUi',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/insert-auth-status#InsertAuthStatus',
        },
      },
    },
    { name: 'accessToken', type: 'text', admin: { hidden: true } },
    { name: 'refreshToken', type: 'text', admin: { hidden: true } },
    { name: 'expiresAt', type: 'date', admin: { hidden: true } },
    { name: 'isConnected', type: 'checkbox', defaultValue: false, admin: { hidden: true } },
  ],
}
