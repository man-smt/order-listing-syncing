import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FocusEvent,
} from 'react'
import {
  Button,
  Box,
  TextField,
  Popover,
  OptionList,
  Select,
  Icon,
  Scrollable,
  InlineStack,
  BlockStack,
  InlineGrid,
  DatePicker,
} from '@shopify/polaris'
// import { CalendarMajor, ArrowRightMinor } from '@shopify/polaris-icons'
import { useBreakpoints } from '@shopify/polaris'

interface Range {
  title: string
  alias: string
  period: {
    since: Date
    until: Date
  }
}
export const formatDateToYearMonthDayDateString = (date: Date) => {
  const year = String(date.getFullYear())
  let month = String(date.getMonth() + 1)
  let day = String(date.getDate())
  if (month.length < 2) {
    month = String(month).padStart(2, '0')
  }
  if (day.length < 2) {
    day = String(day).padStart(2, '0')
  }
  return [year, month, day].join('-')
}

const DateRangePicker = ({ selectedDateRange, setSelectedDateRange }: any) => {
  const { mdDown, lgUp } = useBreakpoints()
  const shouldShowMultiMonth = lgUp
  const today = new Date(new Date().setHours(0, 0, 0, 0))
  console.log(today, 'today')
  const yesterday = new Date(
    new Date(new Date().setDate(today.getDate() - 1)).setHours(0, 0, 0, 0)
  )
  const [inputValues, setInputValues] = useState<{
    since?: string
    until?: string
  }>(selectedDateRange)

  const ranges: Range[] = [
    {
      title: 'Today',
      alias: 'today',
      period: {
        since: today,
        until: today,
      },
    },
    {
      title: 'Yesterday',
      alias: 'yesterday',
      period: {
        since: yesterday,
        until: yesterday,
      },
    },
    {
      title: 'Last 7 days',
      alias: 'last7days',
      period: {
        since: new Date(
          new Date(new Date().setDate(today.getDate() - 7)).setHours(0, 0, 0, 0)
        ),
        until: yesterday,
      },
    },
  ]

  const [popoverActive, setPopoverActive] = useState(false)
  const [activeDateRange, setActiveDateRange] = useState<Range>(ranges[0])

  const [{ month, year }, setDate] = useState<{ month: number; year: number }>({
    month: activeDateRange.period.since.getMonth(),
    year: activeDateRange.period.since.getFullYear(),
  })
  const datePickerRef = useRef<HTMLDivElement>(null)

  const VALID_YYYY_MM_DD_DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}/

  function isDate(date: string) {
    return !isNaN(new Date(date).getDate())
  }

  function isValidYearMonthDayDateString(date: string) {
    return VALID_YYYY_MM_DD_DATE_REGEX.test(date) && isDate(date)
  }

  function isValidDate(date: string) {
    return date.length === 10 && isValidYearMonthDayDateString(date)
  }

  function parseYearMonthDayDateString(input: string) {
    const [year, month, day] = input.split('-')
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  function formatDate(date: Date) {
    return formatDateToYearMonthDayDateString(date)
  }

  function nodeContainsDescendant(rootNode: Node, descendant: Node): boolean {
    if (rootNode === descendant) {
      return true
    }
    let parent = descendant.parentNode
    while (parent != null) {
      if (parent === rootNode) {
        return true
      }
      parent = parent.parentNode
    }
    return false
  }

  function isNodeWithinPopover(node: Node) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false
  }

  function handleStartInputValueChange(value: string) {
    setInputValues((prevState: any) => {
      return { ...prevState, since: value }
    })
    if (isValidDate(value)) {
      const newSince = parseYearMonthDayDateString(value)
      setActiveDateRange((prevState) => {
        const newPeriod =
          prevState.period && newSince <= prevState.period.until
            ? { since: newSince, until: prevState.period.until }
            : { since: newSince, until: newSince }
        return {
          ...prevState,
          period: newPeriod,
        }
      })
    }
  }

  function handleEndInputValueChange(value: string) {
    setInputValues((prevState: any) => ({ ...prevState, until: value }))
    if (isValidDate(value)) {
      const newUntil = parseYearMonthDayDateString(value)
      setActiveDateRange((prevState) => {
        const newPeriod =
          prevState.period && newUntil >= prevState.period.since
            ? { since: prevState.period.since, until: newUntil }
            : { since: newUntil, until: newUntil }
        return {
          ...prevState,
          period: newPeriod,
        }
      })
    }
  }

  function handleInputBlur({ relatedTarget }: FocusEvent<HTMLInputElement>) {
    const isRelatedTargetWithinPopover =
      relatedTarget != null && isNodeWithinPopover(relatedTarget)
    if (isRelatedTargetWithinPopover) {
      return
    }
    setPopoverActive(false)
  }

  function handleMonthChange(month: number, year: number) {
    setDate({ month, year })
  }

  function handleCalendarChange({ start, end }: { start: Date; end: Date }) {
    const newDateRange = ranges.find((range) => {
      return (
        range.period.since.valueOf() === start.valueOf() &&
        range.period.until.valueOf() === end.valueOf()
      )
    }) || {
      alias: 'custom',
      title: 'Custom',
      period: {
        since: start,
        until: end,
      },
    }
    setActiveDateRange(newDateRange)
  }

  function apply() {
    setPopoverActive(false)
    setSelectedDateRange(inputValues)
  }

  function cancel() {
    setPopoverActive(false)
  }

  useEffect(() => {
    if (activeDateRange) {
      setInputValues({
        since: formatDate(activeDateRange.period.since),
        until: formatDate(activeDateRange.period.until),
      })
      const monthDiff = (
        referenceDate: { month: number; year: number },
        newDate: { month: number; year: number }
      ) => {
        return (
          newDate.month -
          referenceDate.month +
          12 * (referenceDate.year - newDate.year)
        )
      }
      const monthDifference = monthDiff(
        { year, month },
        {
          year: activeDateRange.period.until.getFullYear(),
          month: activeDateRange.period.until.getMonth(),
        }
      )
      if (monthDifference > 1 || monthDifference < 0) {
        setDate({
          month: activeDateRange.period.until.getMonth(),
          year: activeDateRange.period.until.getFullYear(),
        })
      }
    }
  }, [activeDateRange, month, year])

  const buttonValue =
    activeDateRange.title === 'Custom'
      ? activeDateRange.period.since.toDateString() +
        ' - ' +
        activeDateRange.period.until.toDateString()
      : activeDateRange.title

  return (
    <Popover
      active={popoverActive}
      autofocusTarget='none'
      preferredAlignment='right'
      preferredPosition='below'
      fluidContent
      sectioned={false}
      fullHeight
      activator={
        <Button
          size='slim'
          // icon={CalendarMajor}
          onClick={() => setPopoverActive(!popoverActive)}
        >
          {buttonValue}
        </Button>
      }
      onClose={() => {
        setPopoverActive(false)
      }}
    >
      <Popover.Pane fixed>
        <InlineGrid
          columns={{
            xs: '1fr',
            mdDown: '1fr',
            md: 'max-content max-content',
          }}
          gap={0}
          ref={datePickerRef}
        >
          <Box
            maxWidth={mdDown ? '516px' : '212px'}
            width={mdDown ? '100%' : '212px'}
            padding={{ xs: 500, md: 0 }}
            paddingBlockEnd={{ xs: 100, md: 0 }}
          >
            {mdDown ? (
              <Select
                label='dateRangeLabel'
                labelHidden
                onChange={(value: any) => {
                  const result = ranges.find(
                    ({ title, alias }) => title === value || alias === value
                  )
                  setActiveDateRange(result!)
                }}
                value={activeDateRange?.title || activeDateRange?.alias || ''}
                options={ranges.map(({ alias, title }) => title || alias)}
              />
            ) : (
              <Scrollable style={{ height: '334px' }}>
                <OptionList
                  options={ranges.map((range) => ({
                    value: range.alias,
                    label: range.title,
                  }))}
                  selected={activeDateRange.alias}
                  onChange={(value: any) => {
                    setActiveDateRange(
                      ranges.find((range) => range.alias === value[0])!
                    )
                  }}
                />
              </Scrollable>
            )}
          </Box>
          <Box padding={{ xs: 500 }} maxWidth={mdDown ? '320px' : '516px'}>
            <BlockStack gap='400'>
              <InlineStack gap='200'>
                <div style={{ flexGrow: 1 }}>
                  <TextField
                    role='combobox'
                    label={'Since'}
                    labelHidden
                    // prefix={<Icon source={CalendarMajor} />}
                    value={inputValues.since}
                    onChange={(value: string) =>
                      handleStartInputValueChange(value)
                    }
                    onBlur={(event: FocusEvent<HTMLInputElement>) =>
                      handleInputBlur(event)
                    }
                    autoComplete='off'
                  />
                </div>
                {/* <Icon source={ArrowRightMinor} /> */}
                <div style={{ flexGrow: 1 }}>
                  <TextField
                    role='combobox'
                    label={'Until'}
                    labelHidden
                    // prefix={<Icon source={CalendarMajor} />}
                    value={inputValues.until}
                    onChange={(value: string) =>
                      handleEndInputValueChange(value)
                    }
                    onBlur={(event: FocusEvent<HTMLInputElement>) =>
                      handleInputBlur(event)
                    }
                    autoComplete='off'
                  />
                </div>
              </InlineStack>
              <div>
                <DatePicker
                  month={month}
                  year={year}
                  selected={{
                    start: activeDateRange.period.since,
                    end: activeDateRange.period.until,
                  }}
                  onMonthChange={handleMonthChange}
                  onChange={handleCalendarChange}
                  multiMonth={shouldShowMultiMonth}
                  allowRange
                />
              </div>
            </BlockStack>
          </Box>
        </InlineGrid>
      </Popover.Pane>
      <Popover.Pane fixed>
        <Popover.Section>
          <InlineStack gap='200' align='end'>
            <Button onClick={cancel}>Cancel</Button>
            <Button primary onClick={apply}>
              Apply
            </Button>
          </InlineStack>
        </Popover.Section>
      </Popover.Pane>
    </Popover>
  )
}

export default DateRangePicker
