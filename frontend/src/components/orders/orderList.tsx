'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { IndexTable, Filters, useIndexResourceState } from '@shopify/polaris'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { TextField } from '@shopify/polaris'
import { DatePicker } from '@shopify/polaris'
import { debounce } from 'lodash'
import { API_BASE_URL } from '../../api/orders'

export interface OrderItem {
  _id?: string
  orderId: string
  orderDate: Date
  customerName: string
  attributedStaffName: string
  total: number
  commission: number
}

const OrderList = ({
  orders,
  setOrders,
}: {
  orders: OrderItem[]
  setOrders: (orders: OrderItem[]) => void
}) => {
  const [queryValue, setQueryValue] = useState('')
  // const [customerName, setCustomerName] = useState('')
  // const [staffName, setStaffName] = useState('')
  // const [dateRange, setDateRange] = useState<any>({ start: null, end: null })

  const handleQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  )
  // const handleCustomerChange = useCallback(
  //   (value: string) => setCustomerName(value),
  //   []
  // )
  // const handleStaffChange = useCallback(
  //   (value: string) => setStaffName(value),
  //   []
  // )
  // const handleDateRangeChange = useCallback(
  //   (value: string) => setDateRange(value),
  //   []
  // )

  // const handleClearAll = useCallback(() => {
  //   setQueryValue('')
  //   setCustomerName('')
  //   setStaffName('')
  //   setDateRange({ start: null, end: null })
  // }, [])

  const logFilters = useCallback(
    debounce(() => {
      console.log('Filters changed:', {
        queryValue,
      })

      const fetchData = async () => {
        const response = await axios.get(
          `${API_BASE_URL}/orders?queryValue=${queryValue}`
        )

        setOrders(response.data)
      }
      fetchData()
    }, 1500),

    [queryValue]
  )

  useEffect(() => {
    logFilters()
  }, [logFilters])

  // const filters = [
  //   {
  //     key: 'customerName',
  //     label: 'Customer name',
  //     filter: (
  //       <TextField
  //         value={customerName}
  //         onChange={handleCustomerChange}
  //         placeholder='Customer name'
  //       />
  //     ),
  //   },
  //   {
  //     key: 'staffName',
  //     label: 'Attributed staff name',
  //     filter: (
  //       <TextField
  //         value={staffName}
  //         onChange={handleStaffChange}
  //         placeholder='Staff name'
  //       />
  //     ),
  //   },
  //   {
  //     key: 'dateRange',
  //     label: 'Date range',
  //     filter: (
  //       <DatePicker
  //         month={dateRange.start?.getMonth() || 0}
  //         year={dateRange.start?.getFullYear() || new Date().getFullYear()}
  //         onChange={handleDateRangeChange}
  //         onMonthChange={() => {}}
  //         selected={dateRange}
  //         allowRange
  //       />
  //     ),
  //   },
  // ]

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders)

  const rowMarkup = orders.map(
    (
      {
        _id,
        orderId,
        orderDate,
        customerName,
        attributedStaffName,
        total,
        commission,
      }: OrderItem,
      index: number
    ) => (
      <IndexTable.Row
        id={_id}
        key={_id}
        selected={selectedResources.includes(_id)}
        position={index}
      >
        <IndexTable.Cell>{orderId}</IndexTable.Cell>
        <IndexTable.Cell>
          {new Date(orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </IndexTable.Cell>
        <IndexTable.Cell>{customerName}</IndexTable.Cell>
        <IndexTable.Cell>{attributedStaffName}</IndexTable.Cell>
        <IndexTable.Cell>${total}</IndexTable.Cell>
        <IndexTable.Cell>${commission}</IndexTable.Cell>
      </IndexTable.Row>
    )
  )

  return (
    <>
      <div
        style={{
          marginBottom: '10px',
        }}
      >
        <TextField
          autoComplete='off'
          value={queryValue}
          onChange={handleQueryChange}
          placeholder='Search by customer name or attributed staff name'
        />
      </div>
      {/* <Filters
        queryValue={queryValue}
        placeholder='Search orders'
        filters={filters}
        onQueryChange={handleQueryChange}
        onClearAll={handleClearAll}
      /> */}
      <Toaster />
      <IndexTable
        selectable={false}
        resourceName={{ singular: 'order', plural: 'orders' }}
        itemCount={orders.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: 'Order ID' },
          { title: 'Order Date' },
          { title: 'Customer Name' },
          { title: 'Attributed Staff Name' },
          { title: 'Total' },
          { title: 'Commission' },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </>
  )
}

export default OrderList
