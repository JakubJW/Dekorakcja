import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { navGroup } from '@/fields/navGroup'
import { revalidatePath } from 'next/cache'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short paragraph shown under the logo in the footer.',
      },
      label: 'Short description',
    },
    navGroup({ name: 'navGroup1', label: 'Navigation column 1' }),
    navGroup({ name: 'navGroup2', label: 'Navigation column 2' }),
    {
      name: 'contactGroup',
      type: 'group',
      fields: [
        {
          name: 'header',
          type: 'text',
          label: 'Column header',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'contactType',
                  type: 'radio',
                  admin: {
                    layout: 'horizontal',
                    width: '50%',
                  },
                  defaultValue: 'email',
                  options: [
                    {
                      label: 'Email',
                      value: 'email',
                    },
                    {
                      label: 'Phone',
                      value: 'phone',
                    },
                  ],
                },
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    description: 'Optional display override; defaults to the value.',
                    width: '50%',
                  },
                  label: 'Display label (optional)',
                },
              ],
            },
            {
              name: 'value',
              type: 'text',
              label: 'Email address or phone number',
              required: true,
            },
          ],
          label: 'Contact links',
          maxRows: 6,
        },
      ],
      label: 'Contact column',
    },
  ],
  hooks: {
    afterChange: [
      (data) => {
        if (data.global) {
          revalidatePath('/', 'layout')
        }
      },
    ],
  },
}
