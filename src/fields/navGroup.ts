import type { Field, GroupField } from 'payload'

import { deepMerge } from '@/utilities/deepMerge'

import { linkGroup } from './linkGroup'

type NavGroupType = (options: {
  label?: string
  name: string
  overrides?: Partial<GroupField>
}) => Field

export const navGroup: NavGroupType = ({ name, label, overrides = {} }) => {
  const generatedNavGroup: Field = {
    name,
    type: 'group',
    fields: [
      {
        name: 'header',
        type: 'text',
        label: 'Column header',
      },
      linkGroup({
        appearances: false,
        overrides: {
          maxRows: 6,
        },
      }),
    ],
    label,
  }

  return deepMerge(generatedNavGroup, overrides)
}
