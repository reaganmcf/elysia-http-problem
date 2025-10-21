# elysia-http-problem

> **⚠️ Work in Progress** - This project is under active development and may have breaking changes.

A plugin for [Elysia.js](https://elysiajs.com/) that provides standardized HTTP problem responses in JSON format, following [RFC 7807](https://tools.ietf.org/html/rfc7807).

## Installation

```bash
bun add elysia-http-problem
```

## Usage

Import and use the plugin in your Elysia app:

```typescript
import { Elysia } from 'elysia'
import { elysiaHttpProblem } from 'elysia-http-problem'

const app = new Elysia()
  .use(elysiaHttpProblem())
  .get('/', () => 'Hello World')
  .listen(3000)
```

The plugin automatically converts Elysia errors into Problem JSON responses:

- `ValidationError` → 400 Bad Request
- `NotFoundError` → 404 Not Found
- `InternalServerError` or generic `Error` → 500 Internal Server Error

## Manual Error Handling

You can also manually throw Problem errors:

```typescript
import { HttpError } from 'elysia-http-problem'

app.get('/api/user/:id', ({ params: { id } }) => {
  if (!userExists(id)) {
    throw new HttpError.NotFound(`User ${id} not found`)
  }
  return getUser(id)
})
```

## Available Errors

The plugin provides error classes for common HTTP status codes:

- `HttpError.BadRequest` (400)
- `HttpError.Unauthorized` (401)
- `HttpError.Forbidden` (403)
- `HttpError.NotFound` (404)
- `HttpError.Conflict` (409)
- `HttpError.InternalServerError` (500)
- And more...

## Response Format

All errors return a JSON response following RFC 7807:

```json
{
  "type": "https://httpstatuses.com/404",
  "title": "Not Found",
  "status": 404,
  "detail": "The requested resource was not found"
}
```

## License

MIT