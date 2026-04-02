import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import routes from './routes'
import { errorHandler } from './middleware/errorHandler.middleware'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use('/api', routes)
app.use(errorHandler)

const start = () => {
  app.listen(env.PORT, () => {
    console.log(`API server running on :${env.PORT} (${env.NODE_ENV})`)
  })
}
start()
