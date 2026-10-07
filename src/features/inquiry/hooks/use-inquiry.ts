
type CreateInquiry = {
  rentalCartId: number
  customerId?: number
  email?: number
}

export const useInquiry = () => {
  const createInquiry = async (body: CreateInquiry) => {
    try {
      const res = await fetch('/next/inquiry', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const json = await res.json()

      return json
    } catch (error) {
      return error
    }
  }

  return { createInquiry }
}
