'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { IndexTable, Filters, useIndexResourceState } from '@shopify/polaris'
import axios from 'axios'
import { fetchData } from '../../api/orders'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [queryValue, setQueryValue] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [staffName, setStaffName] = useState('')
  const [dateRange, setDateRange] = useState({ start: null, end: null })

  const handleQueryChange = useCallback(
    (value: any) => setQueryValue(value),
    []
  )
  const handleCustomerChange = useCallback(
    (value: any) => setCustomerName(value),
    []
  )
  const handleStaffChange = useCallback((value: any) => setStaffName(value), [])
  const handleDateRangeChange = useCallback(
    (value: any) => setDateRange(value),
    []
  )

  const handleClearAll = useCallback(() => {
    setQueryValue('')
    setCustomerName('')
    setStaffName('')
    setDateRange({ start: null, end: null })
  }, [])

  useEffect(() => {
    fetchData().then((data) => setOrders(data))
  }, [])

  const filters = [
    {
      key: 'customerName',
      label: 'Customer name',
      filter: (
        <Filters.TextField
          value={customerName}
          onChange={handleCustomerChange}
          placeholder='Customer name'
        />
      ),
    },
    {
      key: 'staffName',
      label: 'Attributed staff name',
      filter: (
        <Filters.TextField
          value={staffName}
          onChange={handleStaffChange}
          placeholder='Staff name'
        />
      ),
    },
    {
      key: 'dateRange',
      label: 'Date range',
      filter: (
        <Filters.DateSelector
          dateRange={dateRange}
          onChange={handleDateRangeChange}
        />
      ),
    },
  ]

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
      },
      index
    ) => (
      <IndexTable.Row
        id={_id}
        key={_id}
        selected={selectedResources.includes(_id)}
        position={index}
      >
        <IndexTable.Cell>{orderId}</IndexTable.Cell>
        <IndexTable.Cell>{orderDate}</IndexTable.Cell>
        <IndexTable.Cell>{customerName}</IndexTable.Cell>
        <IndexTable.Cell>{attributedStaffName}</IndexTable.Cell>
        <IndexTable.Cell>${total}</IndexTable.Cell>
        <IndexTable.Cell>${commission}</IndexTable.Cell>
      </IndexTable.Row>
    )
  )

  return (
    <>
      {orders?.length ? (
        <Filters
          queryValue={queryValue}
          filters={filters}
          onQueryChange={handleQueryChange}
          onClearAll={handleClearAll}
        />
      ) : (
        ''
      )}
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
