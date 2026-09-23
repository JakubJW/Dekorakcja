'use client'

import { createContext, useContext, useState } from 'react'

type RentalCartContext = {
  addItem: () => void
  items: number
}

const Context = createContext({} as RentalCartContext)

export const RentalCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState(0)

  const addItem = () => setItems((prev) => prev + 1)

  return <Context.Provider value={{ addItem, items }}>{children}</Context.Provider>
}

type UseRentalCart = () => RentalCartContext

export const useRentalCart: UseRentalCart = () => useContext(Context)
