'use client'
import React from 'react'
import { Page, Button, LegacyCard } from '@shopify/polaris'
import OrderList from './orderList'
import { syncData } from '../../api/orders'

const Orders = () => {
  return (
    <Page
      backAction={{ content: 'Settings', url: '/' }}
      title='Orders and Commissions'
      primaryAction={
        <Button variant='primary' onClick={syncData}>
          Sync
        </Button>
      }
    >
      <LegacyCard sectioned>
        <OrderList />
      </LegacyCard>
    </Page>
  )
}
export default Orders
