'use client'

import { useFormFields } from '@payloadcms/ui'

export const InsertAuthStatus = () => {
  const isConnected = useFormFields(([fields]) => fields.isConnected?.value as boolean)
  const expiresAt = useFormFields(([fields]) => fields.expiresAt?.value as string)

  const handleLogin = () => {
    window.location.href = '/next/insert/login'
  }

  const handleDisconnect = async () => {
    if (confirm('Czy na pewno chcesz odłączyć integrację z Subiektem 123?')) {
      window.location.href = '/api/insert/disconnect'
    }
  }

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid var(--theme-elevation-200)',
        backgroundColor: 'var(--theme-elevation-50)',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Status połączenia z Subiekt 123</h4>
          {isConnected ? (
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#e6f4ea',
                  color: '#137333',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                ● Połączono z InsERT
              </span>
              {expiresAt && (
                <p
                  style={{
                    margin: '8px 0 0 0',
                    fontSize: '12px',
                    color: 'var(--theme-elevation-500)',
                  }}
                >
                  Ważność tokena: {new Date(expiresAt).toLocaleString('pl-PL')}
                </p>
              )}
            </div>
          ) : (
            <span
              style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: '#fce8e6',
                color: '#c5221f',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              ○ Brak aktywnej integracji
            </span>
          )}
        </div>

        <div>
          {isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              style={{
                padding: '10px 16px',
                borderRadius: '4px',
                border: '1px solid #d93025',
                backgroundColor: 'transparent',
                color: '#d93025',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Rozłącz integrację
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              style={{
                padding: '10px 18px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#1a73e8',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Zaloguj do Subiekt 123
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
