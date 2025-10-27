# elysia-http-problem-json

A simple plugin for Elysia that turns errors into nice JSON problem responses.

## Install

```bash
bun add elysia-http-problem-json
```

## Quick Start

```typescript
import { Elysia } from 'elysia'
import { elysiaHttpProblem } from 'elysia-http-problem-json'

const app = new Elysia()
  .use(elysiaHttpProblem())
  .get('/', () => 'Hello')
  .listen(3000)
```

It auto-converts Elysia errors:

- ValidationError → 400 Bad Request
- NotFoundError → 404 Not Found
- InvalidCookieSignature → 400 Bad Request
- InvalidFileType → 400 Bad Request
- InternalServerError/Error → 500 Internal Server Error

## Manual Errors

Throw your own:

```typescript
import { HttpError } from 'elysia-http-problem-json'

app.get('/user/:id', ({ params }) => {
  if (!userExists(params.id)) {
    throw new HttpError.NotFound('User not found')
  }
  return getUser(params.id)
})
```

## All Error Types

- BadRequest (400)
- Unauthorized (401)
- PaymentRequired (402)
- Forbidden (403)
- NotFound (404)
- MethodNotAllowed (405)
- NotAcceptable (406)
- Conflict (409)
- InternalServerError (500)
- NotImplemented (501)
- BadGateway (502)
- ServiceUnavailable (503)
- GatewayTimeout (504)

## Response

Follows [RFC 7807](https://tools.ietf.org/html/rfc7807) Problem Details spec. All errors return JSON with standard fields plus extensions for extra info.

Examples:

**Not Found (404):**
```json
{
  "type": "https://httpstatuses.com/404",
  "title": "Not Found",
  "status": 404,
  "detail": "User not found"
}
```

**Bad Request with validation errors (400):**
```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Bad Request",
  "status": 400,
  "detail": "The request is invalid",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["id"],
      "message": "Invalid input"
    }
  ]
}
```

**Bad Request with invalid cookie (400):**
```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Bad Request",
  "status": 400,
  "detail": "The provided cookie signature is invalid",
  "key": "session"
}
```

**Internal Server Error (500):**
```json
{
  "type": "https://httpstatuses.com/500",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "Database connection failed"
}
```

## License

MIT