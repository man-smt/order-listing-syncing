'use client'
import translations from '@shopify/polaris/locales/en.json'
import { AppProvider, CalloutCard } from '@shopify/polaris'
import '@shopify/polaris/build/esm/styles.css'
import OrderList from '../components/orders/page'

export default function Home() {
  return (
    <AppProvider i18n={translations}>
      <OrderList />
    </AppProvider>
  )
}