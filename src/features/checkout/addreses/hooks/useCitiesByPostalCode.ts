export const useCitiesByPostalCode = () => {
  const getCities = async (zipCode: string) => {
    const res = await fetch(`https://kodpocztowy.intami.pl/api/${zipCode}`)

    const json = await res.json()

    return { label: json.miejscowosc, value: json.miejscowosc }
  }

  return { getCities }
}
