type BaseShipmentEvent<TEvent extends string, TPayload> = {
  event_ts: string
  event: TEvent
  organization_id: number
  payload: TPayload
}

type ShipmentConfirmedPayload = {
  shipment_id: number
  tracking_number: string
}

type ShipmentStatusChangedPayload = {
  shipment_id: number
  tracking_number: string
  status: string
}

type ShipmentConfirmedEvent = BaseShipmentEvent<'shipment_confirmed', ShipmentConfirmedPayload>
type ShipmentStatusChangedEvent = BaseShipmentEvent<
  'shipment_status_changed',
  ShipmentStatusChangedPayload
>

export type ShipmentWebhookEvent = ShipmentConfirmedEvent | ShipmentStatusChangedEvent
