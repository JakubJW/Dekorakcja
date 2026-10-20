export interface TokenStorage {
  getAccessToken(): Promise<string | null>
  getRefreshToken(): Promise<string | null>
  saveTokens(tokens: {
    access_token: string
    refresh_token: string
    expires_in: number
  }): Promise<void>
}

export class InsertTokenManager {
  constructor(private storage: TokenStorage) {}

  async getValidAccessToken(): Promise<string> {
    const accessToken = await this.storage.getAccessToken()
    // Tutaj możesz sprawdzić datę wygaśnięcia z bazy
    // Jeśli wygasł (lub nie ma):
    // return await this.refreshTokens();

    if (!accessToken) {
      throw new Error('Brak aktywnej autoryzacji z InsERT. Wymagane ponowne połączenie.')
    }

    return accessToken
  }

  async refreshTokens(): Promise<string> {
    const refreshToken = await this.storage.getRefreshToken()
    if (!refreshToken) throw new Error('Brak refresh_token.')

    const res = await fetch('https://kontoapi.insert.com.pl/connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.INSERT_CLIENT_ID!,
        client_secret: process.env.INSERT_CLIENT_SECRET!,
        refresh_token: refreshToken,
      }),
    })

    if (!res.ok) {
      throw new Error(`Błąd odświeżania tokena InsERT: ${res.statusText}`)
    }

    const data = await res.json()

    await this.storage.saveTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    })

    return data.access_token
  }
}
