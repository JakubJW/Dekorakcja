export type SortFilterItem = {
  reverse: boolean
  slug: null | string
  title: string
}

export const defaultSort: SortFilterItem = {
  slug: null,
  reverse: false,
  title: 'Alfabetycznie',
}

export const sorting: SortFilterItem[] = [
  defaultSort,
  { slug: '-createdAt', reverse: true, title: 'Najnowsze' },
  { slug: 'priceInPLN', reverse: false, title: 'Cena rosnąco' },
  { slug: '-priceInPLN', reverse: true, title: 'Cena malejąco' },
]
