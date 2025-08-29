import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as OpenApiValidator from 'express-openapi-validator'
import accountsRouter from '@/routes/accounts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const port = 3003

// Middleware
app.use(cors())
app.use(express.json())

// Load OpenAPI spec
const openApiPath = join(__dirname, 'docs/openapi.yaml')
const apiSpec = YAML.load(openApiPath)

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec))

// OpenAPI request/response validation
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
)

// API Routes
app.use('/v1/accounts', accountsRouter)

// Error handler
app.use(
  (
    err: Error & { status?: number; code?: string },
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction,
  ) => {
    console.error('Error:', err)
    res.status(err.status || 500).json({
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    })
  },
)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
