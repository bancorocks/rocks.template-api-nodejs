# Rocks Accounts API

Accounts API

## Features

- OpenAPI 3.0.3 specification with Swagger UI at `/docs`
- Request/response validation via express-openapi-validator
- In-memory persistence with json-server mirror at `/_db`
- Idempotency support on POST /v1/accounts
- ESLint v9 + Prettier
- Commitizen + Release-it for versioning

## Getting Started

```bash
# Install dependencies
pnpm i

# Start dev server
pnpm dev
```

The server will be running at http://localhost:3003.

## API Endpoints

### POST /v1/accounts

Opens a new account.

```bash
curl -X POST http://localhost:3003/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-key-123" \
  -d '{
    "name": "John Doe",
    "document": "12345678901"
  }'
```

#### Idempotency

- Same key + same payload → 409 Duplicate
- Same key + different payload → 400 Invalid
- New/different key → 201 Created

### GET /v1/accounts/{accountId}

Retrieves account details.

```bash
curl http://localhost:3003/v1/accounts/7b9e6432-8c13-4b8e-9c45-1d2a3f456b78
```

## Documentation

- API docs: http://localhost:3003/docs
- DB browser: http://localhost:3003/\_db

## Development

- `pnpm dev` - Start dev server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Check for linting issues
- `pnpm format` - Format code with Prettier

## Release Process

1. Stage your changes
2. Run `pnpm commit` to create a conventional commit
3. Run `pnpm release` to create a release
   - Requires GitHub token with repo scope
   - Set via `GITHUB_TOKEN` environment variable
