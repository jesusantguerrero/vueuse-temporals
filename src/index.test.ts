import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import {
  addDays,
  addMonths,
  addWeeks,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns'
import { isDateIn, isSameDate } from './utils/index'
import { PAGER_MODES, getCalendarISO, useDatePager } from '.'

const formatDay = (date: Date) => date.toISOString().slice(0, 10)
describe('useDatePager default', () => {
  const nextMode = ref('day')
  const initialDate = ref(new Date())

  const { controls, selectedDay } = useDatePager({
    nextMode: nextMode.value,
    initialDate: initialDate.value
  })
  it('should have today as selected day', () => {
    expect(formatDay(new Date())).toEqual(formatDay(selectedDay.value))
  })

  it('should select the next', () => {
    const nextDate = addDays(selectedDay.value, 1)
    controls.next()
    expect(selectedDay.value).toEqual(nextDate)
  })
  it('should select the previous day', () => {
    const previousDate = subDays(selectedDay.value, 1)
    controls.previous()
    expect(startOfDay(selectedDay.value)).toEqual(startOfDay(previousDate))
  })
})

describe('useDatePager week mode', () => {
  const initialDate = ref(new Date())

  const { controls, selectedDay, selectedSpan } = useDatePager({
    nextMode: PAGER_MODES.WEEK,
    initialDate: initialDate.value
  })

  it('should have today as selected day and week', () => {
    expect(formatDay(new Date())).toEqual(formatDay(selectedDay.value))
  })

  it('should select the next week', () => {
    const nextWeek = addWeeks(selectedDay.value, 1)
    controls.next()
    expect(isDateIn(nextWeek, selectedSpan.value)).toBeTruthy()
  })
  it('should select the previous week', () => {
    const previousWeek = subWeeks(selectedDay.value, 1)
    controls.previous()
    expect(isDateIn(previousWeek, selectedSpan.value)).toBeTruthy()
  })
})
describe('useDatePager month mode', () => {
  const initialDate = ref(new Date())

  const { controls, selectedDay, selectedSpan } = useDatePager({
    nextMode: PAGER_MODES.MONTH,
    initialDate: initialDate.value
  })

  it('should have today as selected day', () => {
    expect(formatDay(new Date())).toEqual(formatDay(selectedDay.value))
  })

  it('should select the next month', () => {
    const nextMonth = addMonths(selectedDay.value, 1)
    controls.next()
    expect(isDateIn(nextMonth, selectedSpan.value)).toBeTruthy()
  })
  it('should select the previous month', () => {
    const previousMonth = subMonths(selectedDay.value, 1)
    controls.previous()
    expect(isDateIn(previousMonth, selectedSpan.value)).toBeTruthy()
  })
})

describe('useDatePager iso duration mode', () => {
  it('should return valid ranges from iso Duration Format', () => {
    const dates = getCalendarISO(new Date(), 'P5D')

    expect(dates.length).toBe(6)
  })
  it('should return valid ranges from iso Duration Format Fixed', () => {
    const dates = getCalendarISO(new Date(), 'P3M', { fixedMonth: true })

    const start = startOfMonth(subDays(new Date(), 90))

    expect(isSameDate(dates[0], start)).toBe(true)
  })

  it('should return valid ranges from iso Duration Format', () => {
    const dates = getCalendarISO(new Date(), 'P3M')

    const start = subDays(new Date(), 90)

    expect(isSameDate(dates[0], start)).toBe(true)
  })

  it('should select the next 3 months', () => {
    const initialDate = ref(new Date())
    const { controls, selectedDay, endDate } = useDatePager({
      nextMode: 'P3M',
      initialDate: initialDate.value
    })

    const next3Months = addMonths(selectedDay.value, 3)
    controls.next()

    expect(isSameDate(next3Months, endDate.value)).toBeTruthy()
  })

  it('should select the previous months', () => {
    const initialDate = ref(new Date())
    const { controls, selectedDay, endDate } = useDatePager({
      nextMode: 'P3M',
      initialDate: initialDate.value
    })

    const ThreeMonthsAgo = subDays(selectedDay.value, 90)
    controls.previous()

    expect(isSameDate(ThreeMonthsAgo, endDate.value)).toBeTruthy()
  })
  it('should select the previous year', () => {
    const initialDate = ref(new Date())
    const { controls, selectedDay, endDate } = useDatePager({
      nextMode: 'P1Y',
      initialDate: initialDate.value
    })

    const ThreeMonthsAgo = subYears(selectedDay.value, 1)
    controls.previous()

    expect(isSameDate(ThreeMonthsAgo, endDate.value)).toBeTruthy()
  })
})
