import schedule from 'node-schedule'
import { fetchOrdersFromShopify } from '../services/shopifyService'
import { Order } from '../models/order'

const syncData = async () => {
  console.log('Syncing data...')

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
}

schedule.scheduleJob('0 * * * *', async () => {
  syncData()
})
