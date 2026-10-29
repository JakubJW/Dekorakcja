import { env } from '@/env'

import { InsertTokenManager } from './insert-token-manager'

export class InsertHttpClient {
  private baseUrl = 'https://api.subiekt123.pl/1.1'

  constructor(private tokenManager: InsertTokenManager) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const accessToken = await this.tokenManager.getValidAccessToken()

    const headers: Record<string, string> = {
      'x-api-version': '1.1',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Ocp-Apim-Subscription-Key': env.INSERT_SUBSCRIPTION_KEY || '',
      ...(options.headers as Record<string, string> | undefined),
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      const newAccessToken = await this.tokenManager.refreshTokens()
      headers['Authorization'] = `Bearer ${newAccessToken}`

      response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })
    }

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`InsERT API Error [${response.status}]: ${errorBody}`)
    }

    return response.json() as Promise<T>
  }
}
