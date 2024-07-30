import schedule from 'node-schedule'
import { fetchOrdersFromShopify } from '../services/shopifyService'
import { Order } from '../models/order'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URI

const syncData = async () => {
  if (mongoUri) {
    mongoose
      .connect(mongoUri)
      .then(async () => {
        const ordersFromShopify = await fetchOrdersFromShopify()

        const promises = ordersFromShopify.map(async (order: any) => {
          try {
            await Order.findOneAndUpdate(
              { orderId: order.orderId },
              { $set: order },
              { upsert: true, new: true }
            )
          } catch (err) {
            console.error('Error while updating order:', err)
          }
        })

        await Promise.all(promises)
        console.log('Data synced successfully')
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB', err)
      })
  }
}

schedule.scheduleJob('0 * * * *', async () => {
  syncData()
})
