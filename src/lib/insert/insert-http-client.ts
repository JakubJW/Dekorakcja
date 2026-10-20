import { InsertTokenManager } from './insert-token-manager'

export class InsertHttpClient {
  private baseUrl = 'https://api.insert.com.pl/subiekt123'

  constructor(private tokenManager: InsertTokenManager) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const accessToken = await this.tokenManager.getValidAccessToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Ocp-Apim-Subscription-Key': process.env.INSERT_SUBSCRIPTION_KEY || '',
      ...options.headers,
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    // Jeśli token wygasł w trakcie (401), spróbuj odświeżyć i ponowić zapytanie jeden raz
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
