import { Request, Response } from 'express'
import { Order } from '../models/order'
import { fetchOrdersFromShopify } from '../services/shopifyService'

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { queryValue, startDate, endDate } = req.query

    const filter: any = {}

    if (queryValue) {
      const searchTerm = new RegExp(queryValue as string, 'i')

      filter.$or = [
        { customerName: { $regex: searchTerm } },
        { attributedStaffName: { $regex: searchTerm } },
      ]
    }

    if (startDate || endDate) {
      filter.orderDate = {}
      if (startDate && endDate) {
        const startDateDay = new Date(startDate as string)
        startDateDay.setHours(0, 0, 0, 0)

        const endDateDay = new Date(endDate as string)
        endDateDay.setHours(23, 59, 59, 999)

        filter.orderDate = {
          $gte: startDateDay,
          $lte: endDateDay,
        }
      }
    }

    const orders = await Order.find(filter)
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const syncOrders = async (req: Request, res: Response) => {
  try {
    const ordersFromShopify = await fetchOrdersFromShopify()

    for (const order of ordersFromShopify) {
      const existingOrder = await Order.findOne({ orderId: order.orderId })
      if (!existingOrder) {
        await Order.create(order)
      }
    }

    res.json({ message: 'Orders synchronized successfully' })
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: (err as Error).message })
  }
}
