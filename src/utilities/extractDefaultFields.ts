export const extractByName = (fields: any[], names: string[]): any[] =>
  fields.flatMap((field) => {
    if ('name' in field && names.includes(field.name)) return [field]
    if (Array.isArray(field.fields)) return extractByName(field.fields, names)
    if (Array.isArray(field.tabs)) {
      return field.tabs.flatMap((tab: any) => extractByName(tab.fields ?? [], names))
    }
    return []
  })
