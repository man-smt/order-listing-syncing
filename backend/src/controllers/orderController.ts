import { Request, Response } from 'express';
import { Order } from '../models/order';
import { fetchOrdersFromShopify } from '../services/shopifyService';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { customer, staff, startDate, endDate } = req.query;

    const filter: any = {};

    if (customer) {
      filter.customer = customer;
    }

    if (staff) {
      filter.attributedStaff = staff;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }

    // Fetch orders with filters
    const orders = await Order.find(filter);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const syncOrders = async (req: Request, res: Response) => {
  try {
    const ordersFromShopify = await fetchOrdersFromShopify();

    const promises = ordersFromShopify.map(async (order: any) => {
      try {
        await Order.findOneAndUpdate(
          { orderId: order.orderId },
          { $set: order },
          { upsert: true, new: true },
        );
      } catch (err) {
        console.error('Error while updating order:', err);
      }
    });

    // Wait for all promises to complete
    await Promise.all(promises);

    res.json({ message: 'Orders synchronized successfully' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
