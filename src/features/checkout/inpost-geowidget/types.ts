export interface InpostPointInterface {
  address: { line1: string; line2: string }
  address_details: Record<string, unknown>
  apm_doubled: string
  easy_access_zone?: boolean
  image_url: string
  location: { latitude: number; longitude: number }
  location_247: boolean
  location_description: string
  name: string
  opening_hours: string
  operating_hours_extended: Record<string, unknown>
  partner_id: number
  payment_point_descr: string
  payment_type: { '2'?: string }
  physical_type_description?: string
  physical_type_mapped?: string
  recommended_low_interest_box_machines_list: string[]
  type: 'parcel_locker' | 'parcel_locker_superpop' | 'pop' | string
  virtual: string
}

interface InpostGeowidgetElement extends HTMLElement {
  token: string
  language: string
  config: string
  onpoint: string
}

declare global {
  interface HTMLElementTagNameMap {
    'inpost-geowidget': HTMLElement & {
      token: string
      language: string
      config: string
      onpoint?: string
    }
  }

  interface DocumentEventMap {
    onpointselect: CustomEvent<InpostPointInterface>
  }

  namespace JSX {
    interface IntrinsicElements {
      'inpost-geowidget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        InpostGeowidgetElement
      >
    }
  }
}

export { };

