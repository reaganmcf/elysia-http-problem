# elysia-http-problem-json

A simple plugin for Elysia that turns errors into RFC 7807 Problem Details JSON responses.

## Install

```bash
bun add elysia-http-problem-json
```

## Quick Start

```typescript
import { Elysia, t } from 'elysia'
import { httpProblemJsonPlugin, HttpError } from 'elysia-http-problem-json'

const app = new Elysia()
  .use(httpProblemJsonPlugin())
  .get('/user/:id', ({ params }) => {
    const user = db.findUser(params.id)
    if (!user) throw new HttpError.NotFound('User not found')
    return user
  })
  .post('/user', ({ body }) => {
    return createUser(body)
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      age: t.Number({ minimum: 18 })
    })
  })
  .listen(3000)
```

**Returns [RFC 7807](https://tools.ietf.org/html/rfc7807) Problem Details:**
```json
{
  "type": "https://httpstatuses.com/404",
  "title": "Not Found",
  "status": 404,
  "detail": "User not found"
}
```

## Features

- **Auto-converts Elysia errors** – ValidationError, NotFoundError, InvalidCookieSignature, and more
- **Throw custom errors** – Clean HttpError classes for all common status codes  
- **RFC 7807 compliant** – Standard Problem Details JSON format  
- **Extensions supported** – Add custom fields to error responses

## Available Error Types

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

## Response Examples

**Validation Error (400):**
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
      "path": ["age"],
      "message": "Invalid input"
    }
  ]
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
