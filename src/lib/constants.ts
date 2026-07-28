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
  { slug: 'priceInUSD', reverse: false, title: 'Cena rosnąco' },
  { slug: '-priceInUSD', reverse: true, title: 'Cena malejąco' },
]
