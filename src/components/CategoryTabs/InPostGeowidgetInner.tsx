'use client'

import { useEffect, useRef } from 'react'

interface InPostGeowidgetProps {
  token: string
  onPointSelect?: (point: any) => void
  config?: string
  language?: string
}

export default function InPostGeowidgetInner({
  token,
  onPointSelect,
  config = 'parcelCollect',
  language = 'pl',
}: InPostGeowidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const widget = document.createElement('inpost-geowidget')
    widget.setAttribute('token', token)
    widget.setAttribute('language', language)
    widget.setAttribute('config', config)
    widget.setAttribute('onpoint', 'onpointselect')

    container.replaceChildren(widget)

    const handlePointSelection = (event: any) => {
      if (event.detail && onPointSelect) {
        onPointSelect(event.detail)
      }
    }

    document.addEventListener('onpointselect', handlePointSelection)

    return () => {
      document.removeEventListener('onpointselect', handlePointSelection)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [token, language, config, onPointSelect])

  return <div ref={containerRef} className="w-full h-[500px] min-h-[500px] relative" />
}
