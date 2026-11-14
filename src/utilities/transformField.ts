// src/utils/payload/transformFields.ts

type FieldTransformer = (field: any) => any

export const transformFieldsByName = (
  fields: any[],
  transformers: Record<string, FieldTransformer>,
): any[] => {
  return fields.map((field) => {
    if ('name' in field && field.name in transformers) {
      return transformers[field.name](field)
    }

    if (Array.isArray(field.fields)) {
      return {
        ...field,
        fields: transformFieldsByName(field.fields, transformers),
      }
    }

    if (Array.isArray(field.tabs)) {
      return {
        ...field,
        tabs: field.tabs.map((tab: any) => ({
          ...tab,
          fields: transformFieldsByName(tab.fields ?? [], transformers),
        })),
      }
    }

    return field
  })
}
