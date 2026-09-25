import { Where } from 'payload'

export type FiltersConfig = {
  searchValue?: string | string[]
  sort?: string | string[]
  category?: string | string[]
  occasion?: string | string[]
}

export const prepareFilters = (config: FiltersConfig) => {
  const { sort = 'title', searchValue, category, occasion } = config

  const andConditions: Where[] = []

  if (searchValue) {
    andConditions.push({ title: { like: searchValue } })
  }

  if (category) {
    andConditions.push({ categories: { contains: category } })
  }

  if (occasion) {
    andConditions.push({ occasions: { contains: occasion } })
  }

  return {
    sort,
    ...(andConditions.length ? { where: { and: andConditions } } : {}),
  }
}
