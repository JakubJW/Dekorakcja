import { Shipment } from '@/payload-types'
import { Link, Pill } from '@payloadcms/ui'
import { Payload } from 'payload'
import { CreateShipmentButton } from './create-shipment-button'
import { ShipmentStatusPoller } from './shipment-status-pooler'

const renderStatus = (shipment: Shipment) => {
  if (!shipment) {
    return (
      <Pill size="small" rounded pillStyle="light-gray">
        Nie rozpoczęto
      </Pill>
    )
  }

  switch (shipment.status) {
    case 'confirmed':
      return (
        <div>
          <Pill size="small" rounded pillStyle="success">
            Wygenerowano list przewozowy
          </Pill>
        </div>
      )
    case 'created':
      return <ShipmentStatusPoller />
    default:
      return <span style={{ color: '#f59e0b' }}>Nieobsługiwany status</span>
  }
}

export async function ShippingStatusUI({ id, payload }: { id: string | number; payload: Payload }) {
  if (!id) return null

  const { docs } = await payload.find({
    collection: 'shipments',
    where: { order: { equals: id } },
    limit: 1,
    sort: '-createdAt',
  })

  const [shipment] = docs

  return (
    <div className="field-type">
      <label className="field-label">Przesyłka</label>
      <div
        style={{ display: 'flex', justifyContent: 'space-between' }}
        className="doc-controls__list-item"
      >
        <span className="doc-controls__label">Status</span>
        {renderStatus(shipment)}
      </div>

      {shipment ? (
        <>
          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className="doc-controls__list-item"
          >
            <span className="doc-controls__label">Przewoźnik</span>
            <span className="doc-controls__value">{shipment.provider}</span>
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className="doc-controls__list-item"
          >
            <span className="doc-controls__label">Nr śledzenia</span>
            <Link
              href={`/admin/collections/shipments/${shipment.id}`}
              className="doc-controls__value"
            >
              {shipment.trackingNumber}
            </Link>
          </div>

          {shipment.label && typeof shipment.label === 'object' && (
            <div
              style={{ display: 'flex', justifyContent: 'space-between' }}
              className="doc-controls__list-item"
            >
              <span className="doc-controls__label">Etykieta</span>
              <Link href={shipment.label.url} target="_blank" className="doc-controls__value">
                {shipment.label.filename}
              </Link>
            </div>
          )}
        </>
      ) : (
        <CreateShipmentButton orderId={id} />
      )}
    </div>
  )
}
