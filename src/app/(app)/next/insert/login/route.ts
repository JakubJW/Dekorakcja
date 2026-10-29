import { env } from '@/env'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url')
}

function generateCodeChallenge(verifier: string) {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

export async function GET() {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)
  const state = crypto.randomBytes(16).toString('hex')
  const jar = await cookies()

  jar.set('code_verifier', codeVerifier, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })

  jar.set('oauth_state', state, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })

  const searchParams = new URLSearchParams({
    client_id: env.INSERT_CLIENT_ID,
    redirect_uri: env.INSERT_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email subiekt123 offline_access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  const authUrl = `https://kontoapi.insert.com.pl/connect/authorize?${searchParams.toString()}`

  return NextResponse.redirect(authUrl)
}
