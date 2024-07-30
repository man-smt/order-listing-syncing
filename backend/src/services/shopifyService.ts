import fs from 'fs'
import path from 'path'
import { calculateCommission } from './rulesEngine'

const mockDataPath = path.join(__dirname, '../data/mockData.json')

export const fetchOrdersFromShopify = async () => {
  const data = fs.readFileSync(mockDataPath, 'utf-8')
  const mockOrders = JSON.parse(data)

  for (const order of mockOrders) {
    const commission = calculateCommission(order)
    order.commission = commission
  }

  return mockOrders
}
