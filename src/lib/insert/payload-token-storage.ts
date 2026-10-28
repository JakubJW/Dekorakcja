import { Payload } from 'payload'
import { TokenStorage } from './insert-token-manager'

export class PayloadTokenStorage implements TokenStorage {
  constructor(private payload: Payload) {}

  async getAccessToken(): Promise<string | null> {
    const settings = await this.payload.findGlobal({ slug: 'insert-settings' })
    return settings.accessToken || null
  }

  async getRefreshToken(): Promise<string | null> {
    const settings = await this.payload.findGlobal({ slug: 'insert-settings' })
    return settings.refreshToken || null
  }

  async saveTokens(tokens: {
    access_token: string
    refresh_token: string
    expires_in: number
  }): Promise<void> {
    await this.payload.updateGlobal({
      slug: 'insert-settings',
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        isConnected: true,
      },
    })
  }
}
