import { BillingAddress } from '@/payload-types'

export const useBillingAddress = () => {
  const create = async (data: Omit<BillingAddress, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/billing-address`, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      const message = response.statusText || 'There was an error creating the account.'
      console.log(message)
      return
    }
  }

  const getMany = async (customerId: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/billing-addresses?where[customer
      ][equals]=${customerId}&depth=0`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      const message = response.statusText || 'There was an error creating the account.'
      console.log(message)
      return
    }

    return await response.json()
  }

  return {
    create,
    getMany,
  }
}
