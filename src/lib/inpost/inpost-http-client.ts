import { env } from '@/env'

interface CustomRequestInit extends RequestInit {
  responseType?: 'json' | 'buffer'
}

export class InPostHttpClient {
  private readonly baseUrl: string
  private readonly accessToken: string

  constructor() {
    const { INPOST_SHIPX_SECRET } = env

    if (!INPOST_SHIPX_SECRET) {
      throw new Error('Unreachable')
    }

    this.baseUrl = `https://sandbox-api-shipx-pl.easypack24.net/v1`
    this.accessToken = INPOST_SHIPX_SECRET
  }

  async request<T>(endpoint: string, options: CustomRequestInit = {}): Promise<T> {
    const { responseType = 'json', ...fetchOptions } = options

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: responseType === 'buffer' ? 'application/pdf' : 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      ...(fetchOptions.headers as Record<string, string> | undefined),
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`InPost ShipX API Error [${response.status}]: ${errorBody}`)
    }

    if (responseType === 'buffer') {
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer) as unknown as T
    }

    return response.json() as Promise<T>
  }
}
