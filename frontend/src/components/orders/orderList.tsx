'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { IndexTable, Filters, useIndexResourceState } from '@shopify/polaris'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { TextField } from '@shopify/polaris'
import { DatePicker } from '@shopify/polaris'
import { debounce } from 'lodash'
import { API_BASE_URL } from '../../api/orders'
import DateRangePicker, {
  formatDateToYearMonthDayDateString,
} from './datePicker'

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
  const [selectedDateRange, setSelectedDateRange] = useState<{
    since?: string
    until?: string
  }>({
    since: formatDateToYearMonthDayDateString(
      new Date(new Date().setHours(0, 0, 0, 0))
    ),
    until: formatDateToYearMonthDayDateString(
      new Date(new Date().setHours(0, 0, 0, 0))
    ),
  })

  useEffect(() => {
    const fetchData = async () => {
      let url = `${API_BASE_URL}/orders?startDate=${selectedDateRange.since}&endDate=${selectedDateRange.until}`

      if (queryValue?.length > 0) {
        url = `${API_BASE_URL}/orders?startDate=${selectedDateRange.since}&endDate=${selectedDateRange.until}&queryValue=${queryValue}`
      }
      const response = await axios.get(url)
      setOrders(response.data)
    }
    fetchData()
  }, [selectedDateRange])

  const [queryValue, setQueryValue] = useState('')

  const handleQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  )

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
      if (queryValue?.length) {
        fetchData()
      }
    }, 1500),

    [queryValue]
  )

  useEffect(() => {
    logFilters()
  }, [logFilters])

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
          display: 'flex',
          gap: '10px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '70%' }}>
          <TextField
            autoComplete='off'
            value={queryValue}
            onChange={handleQueryChange}
            placeholder='Search by customer name or attributed staff name'
          />
        </div>

        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <DateRangePicker
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
          />
        </div>
      </div>

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
