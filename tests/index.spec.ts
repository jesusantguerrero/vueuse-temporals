import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { addDays, startOfDay, subDays } from 'date-fns'
import { useDatePager } from '../src'

const formatDay = (date: Date) => date.toISOString().slice(0, 10)
describe('useDatePager', () => {
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
