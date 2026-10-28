'use client'

import { useDocumentInfo, usePayloadAPI } from '@payloadcms/ui'
import React, { useState } from 'react'

export const InvoiceStatusUi: React.FC = () => {
  const { id: orderId, savedDocumentData } = useDocumentInfo()
  const [isGenerating, setIsGenerating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // Pobieramy fakturę powiązaną z tym zamówieniem
  const [{ data, isLoading }, { setParams }] = usePayloadAPI('/api/invoices', {
    initialParams: {
      'where[order][equals]': orderId,
      limit: 1,
      sort: '-createdAt', // bierzemy najnowszą
    },
  })

  const invoice = data?.docs?.[0]

  // Jeśli zamówienie nie jest jeszcze zapisane, nie pozwalamy na generowanie faktury
  if (!orderId) {
    return (
      <div style={{ padding: '10px', color: '#666', fontSize: '13px' }}>
        Zapisz zamówienie, aby zarządzać fakturą.
      </div>
    )
  }

  const handleGenerateInvoice = async () => {
    setIsGenerating(true)
    setActionError(null)

    try {
      // Wywołanie Twojego custom endpointu (musisz go stworzyć w Payload)
      const res = await fetch('/api/actions/issue-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Nie udało się wystawić faktury')
      }

      // Odświeżamy dane faktury
      //   setParams((prev) => ({ ...prev }))
      const json = await res.json()
      console.log(json)
    } catch (err: any) {
      setActionError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  // --- Renderowanie stanu ---

  if (isLoading && !invoice) {
    return <div style={{ fontSize: '13px' }}>Sprawdzanie statusu faktury...</div>
  }

  const renderStatus = () => {
    if (!invoice) {
      return <span style={{ color: '#888' }}>Brak faktury</span>
    }

    switch (invoice.status) {
      case 'success':
        return <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Wystawiona</span>
      case 'processing':
        return <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Przetwarzanie...</span>
      case 'failed':
        return <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Błąd (Wymaga akcji)</span>
      default:
        return <span style={{ color: '#f59e0b' }}>Oczekuje</span>
    }
  }

  const showManualOverrideWarning = invoice?.status === 'failed' && invoice?.retryCount >= 3
  const isSuccess = invoice?.status === 'success'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '10px',
        border: '1px solid #eaeaea',
        borderRadius: '6px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>Faktura (Subiekt123):</span>
        {renderStatus()}
      </div>

      {invoice?.invoiceNumber && (
        <div style={{ fontSize: '12px', color: '#666' }}>
          Nr: <strong>{invoice.invoiceNumber}</strong>
        </div>
      )}

      {invoice?.retryCount > 0 && (
        <div style={{ fontSize: '12px', color: '#666' }}>Próby: {invoice.retryCount}</div>
      )}

      {/* Błąd z API zapisany w bazie */}
      {invoice?.lastError && (
        <div
          style={{
            fontSize: '12px',
            color: '#ef4444',
            background: '#fef2f2',
            padding: '6px',
            borderRadius: '4px',
          }}
        >
          {invoice.lastError}
        </div>
      )}

      {/* Błąd z samego kliknięcia przycisku */}
      {actionError && <div style={{ fontSize: '12px', color: '#ef4444' }}>{actionError}</div>}

      {/* Ostrzeżenie po przekroczeniu limitów */}
      {showManualOverrideWarning && (
        <div
          style={{
            fontSize: '12px',
            color: '#b45309',
            background: '#fffbeb',
            padding: '6px',
            borderRadius: '4px',
          }}
        >
          Przekroczono limit automatycznych prób. Ręczne wystawienie faktury może wymagać
          weryfikacji danych.
        </div>
      )}

      {/* Przycisk akcji */}
      {!isSuccess && (
        <button
          onClick={handleGenerateInvoice}
          disabled={isGenerating || invoice?.status === 'processing'}
          style={{
            marginTop: '4px',
            padding: '8px 12px',
            backgroundColor: showManualOverrideWarning ? '#f59e0b' : '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerating || invoice?.status === 'processing' ? 'not-allowed' : 'pointer',
            opacity: isGenerating || invoice?.status === 'processing' ? 0.7 : 1,
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          {isGenerating
            ? 'Wystawianie...'
            : showManualOverrideWarning
              ? 'Wymuś wystawienie (Ręcznie)'
              : 'Wystaw fakturę'}
        </button>
      )}
    </div>
  )
}
