import { env } from '@/env'

export class InPostHttpClient {
  private readonly baseUrl: string
  private readonly accessToken: string

  constructor() {
    const { INPOST_APIX_ORG_ID, INPOST_SHIPX_SECRET } = env

    const missing: string[] = []
    if (!INPOST_APIX_ORG_ID) missing.push('INPOST_APIX_ORG_ID')
    if (!INPOST_SHIPX_SECRET) missing.push('INPOST_SHIPX_SECRET')

    if (missing.length > 0) {
      throw new Error(`Brakuje: ${missing.join(', ')}`)
    }

    if (!INPOST_APIX_ORG_ID || !INPOST_SHIPX_SECRET) {
      throw new Error('Unreachable')
    }

    this.baseUrl = `https://sandbox-api-shipx-pl.easypack24.net/v1/${INPOST_APIX_ORG_ID}`
    this.accessToken = INPOST_SHIPX_SECRET
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      ...(options.headers as Record<string, string> | undefined),
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    // if (response.status === 401) {
    //   const newAccessToken = await this.tokenManager.refreshTokens()
    //   headers['Authorization'] = `Bearer ${newAccessToken}`

    //   response = await fetch(`${this.baseUrl}${endpoint}`, {
    //     ...options,
    //     headers,
    //   })
    // }

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`InPost ShipX API Error [${response.status}]: ${errorBody}`)
    }

    return response.json() as Promise<T>
  }
}
