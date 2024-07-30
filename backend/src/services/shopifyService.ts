import fs from 'fs';
import path from 'path';
import { Order } from '../models/order';
import { calculateCommission } from '../utils/commissionCalculator';

const mockDataPath = path.join(__dirname, '../data/mockData.json');

export const fetchOrdersFromShopify = async () => {
  const data = fs.readFileSync(mockDataPath, 'utf-8');
  const mockOrders = JSON.parse(data);

  for (const order of mockOrders) {
    const commission = calculateCommission(
      new Date(order.orderDate),
      order.total,
      order.productsCount,
    );
    const newOrder = new Order({ ...order, commission });
    await newOrder.save();
  }

  return mockOrders;
};
