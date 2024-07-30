'use client'
import React, { useEffect, useState } from 'react'
import { Page, Button, LegacyCard } from '@shopify/polaris'
import OrderList, { OrderItem } from './orderList'
import { fetchData, syncData } from '../../api/orders'
import toast, { Toaster } from 'react-hot-toast'

const Orders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([])

  const fetchOrders = async () => {
    const data = await fetchData()
    setOrders(data)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <>
      <Toaster />
      <Page
        backAction={{ content: 'Settings', url: '/' }}
        title='Orders and Commissions'
        primaryAction={
          <Button
            variant='primary'
            onClick={async () => {
              await syncData()
              await fetchOrders()
              toast.success('Orders synced successfully')
            }}
          >
            Sync
          </Button>
        }
      >
        <LegacyCard sectioned>
          <OrderList orders={orders} setOrders={setOrders} />
        </LegacyCard>
      </Page>
    </>
  )
}
export default Orders
