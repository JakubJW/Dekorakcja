export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export class ValidationError extends ApiError {
  constructor(public issues: unknown) {
    super(400, 'Błąd walidacji', issues)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Zasób nie znaleziony') {
    super(404, message)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Brak autoryzacji') {
    super(401, message)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Konflikt') {
    super(409, message)
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}
