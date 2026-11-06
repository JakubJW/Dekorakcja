'use client'

import { useEffect, useRef } from 'react'
import { InpostPointInterface } from './types'

export interface InPostGeowidgetProps {
  token: string
  onPointSelect?: (point: InpostPointInterface) => void
  config?: string
  language?: string
}

export default function InpostGeowidget({
  token,
  onPointSelect,
  config = 'parcelCollect',
  language = 'pl',
}: InPostGeowidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onPointSelectRef = useRef(onPointSelect)
  useEffect(() => {
    onPointSelectRef.current = onPointSelect
  }, [onPointSelect])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const widget = document.createElement('inpost-geowidget')
    widget.setAttribute('token', token)
    widget.setAttribute('language', language)
    widget.setAttribute('config', config)
    widget.setAttribute('onpoint', 'onpointselect')

    container.replaceChildren(widget)

    const handlePointSelection = (event: Event) => {
      const customEvent = event as CustomEvent<InpostPointInterface>
      if (customEvent.detail) {
        onPointSelectRef.current?.(customEvent.detail)
      }
    }

    document.addEventListener('onpointselect', handlePointSelection)

    return () => {
      document.removeEventListener('onpointselect', handlePointSelection)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [token, language, config])

  return <div ref={containerRef} className="w-full min-h-[80vh] relative" />
}
