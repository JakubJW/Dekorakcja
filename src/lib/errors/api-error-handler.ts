import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, ValidationError } from './index'

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        message: error.message,
        ...(Boolean(error.details) && { details: error.details }),
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof z.ZodError) {
    return handleApiError(new ValidationError(error.issues))
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ message: 'Nieprawidłowy format JSON' }, { status: 400 })
  }

  return NextResponse.json({ message: 'Błąd serwera' }, { status: 500 })
}
