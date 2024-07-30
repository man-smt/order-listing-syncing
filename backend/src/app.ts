import express from 'express'
import mongoose from 'mongoose'
import orderRoutes from './routes/orderRoutes'
import cors from 'cors'
import * as dotenv from 'dotenv'
import './utils/schedule'

dotenv.config()

const app = express()
const port = process.env.PORT || 8080
const mongoUri = process.env.MONGO_URI

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  })
)

app.use(express.json())
app.use('/api', orderRoutes)

if (!mongoUri) {
  throw new Error('MONGO_URI must be defined')
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server ready at http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err)
  })
