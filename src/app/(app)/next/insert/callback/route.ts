import { env } from '@/env'
import { PayloadTokenStorage } from '@/lib/insert/payload-token-storage'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Brak kodu autoryzacyjnego w adresie URL' }, { status: 400 })
  }

  const jar = await cookies()
  const CODE_VERIFIER = jar.get('code_verifier')

  if (!CODE_VERIFIER) {
    return NextResponse.json({ error: 'Brak code_verifier cookie' }, { status: 400 })
  }

  try {
    const tokenResponse = await fetch('https://kontoapi.insert.com.pl/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: env.INSERT_CLIENT_ID,
        client_secret: env.INSERT_CLIENT_SECRET,
        code: code,
        redirect_uri: env.INSERT_REDIRECT_URI,
        code_verifier: CODE_VERIFIER.value,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Błąd pobierania tokenów', details: tokens },
        { status: tokenResponse.status },
      )
    }

    const payload = await getPayload({ config })
    const storage = new PayloadTokenStorage(payload)
    await storage.saveTokens(tokens)

    jar.delete('code_verifier')
    jar.delete('oauth_state')

    const adminUrl = new URL('/admin/globals/insert-settings', request.url)
    return NextResponse.redirect(adminUrl)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
