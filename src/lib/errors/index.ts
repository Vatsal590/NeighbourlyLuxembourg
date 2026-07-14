export class AppError extends Error {
  status: number
  code: string
  meta?: Record<string, unknown>
  constructor(message: string, status = 500, code = 'app_error', meta?: Record<string, unknown>) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.meta = meta
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input', issues?: unknown) {
    super(message, 422, 'validation_error', { issues })
  }
}

export class AuthError extends AppError {
  constructor(message = 'Not authenticated') { super(message, 401, 'unauthorized') }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') { super(message, 403, 'forbidden') }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') { super(message, 404, 'not_found') }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') { super(message, 409, 'conflict') }
}

export class UpstreamError extends AppError {
  constructor(message = 'Upstream service error', meta?: Record<string, unknown>) {
    super(message, 502, 'upstream_error', meta)
  }
}

export function errorResponse(err: unknown): Response {
  if (err instanceof AppError) {
    return new Response(JSON.stringify({ error: { code: err.code, message: err.message, meta: err.meta } }), {
      status: err.status,
      headers: { 'content-type': 'application/json' }
    })
  }
  const message = err instanceof Error ? err.message : 'Unknown error'
  return new Response(JSON.stringify({ error: { code: 'internal_error', message } }), {
    status: 500,
    headers: { 'content-type': 'application/json' }
  })
}
