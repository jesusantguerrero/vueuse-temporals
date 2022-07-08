import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { addDays, addWeeks, startOfDay, subDays, subWeeks } from 'date-fns'
import { PAGER_MODES, useDatePager } from '../src'
import { isDateIn } from './../src/utils/index'

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
