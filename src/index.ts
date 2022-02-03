import { isLastDayOfMonth, startOfDay } from 'date-fns'
import { ref, watch } from 'vue'
import type { DateOperation } from './utils'
import { addMethods, subMethods } from './utils'

interface Props {
  nextMode: string
  initialDate?: Date
}

export const useDatePager = (props: Props) => {
  const nextMode = ref(props.nextMode)

  // Utils
  const getWeekDays = (date: Date): Array<Date> => {
    const firstDate = new Date(date.setDate(date.getDate() - 4))
    const selectedDateRange: Array<Date> = []
    for (let i = 0; i < 7; i++) {
      firstDate.setDate(firstDate.getDate() + 1)
      selectedDateRange.push(startOfDay(new Date(firstDate)))
    }
    return selectedDateRange
  }

  // state
  const firstDayOfWeek = ref(0)

  // Week
  const selectedDateRange = ref(getWeekDays(new Date()))

  const setWeek = (value: Array<Date>): void => {
    selectedDateRange.value = value || selectedDateRange.value
  }

  const getCalendarWeek = (date: Date) => {
    const firstDate = new Date(date.setDate(date.getDate() - date.getDay() + firstDayOfWeek.value))
    const week = [new Date(firstDate)]
    while (firstDate.setDate(firstDate.getDate() + 1) && firstDate.getDay() !== firstDayOfWeek.value) {
      const weekDate = new Date(new Date(firstDate).setHours(0, 0, 0, 0))
      week.push(weekDate)
    }
    return week
  }

  const getCalendarMonth = (date: Date) => {
    const firstDate = new Date(date.setDate(date.getDate() - (date.getDate() - 1)))
    const month = [new Date(firstDate)]
    while (!isLastDayOfMonth(firstDate)) {
      firstDate.setDate(firstDate.getDate() + 1)
      month.push(new Date(firstDate))
    }
    return month
  }

  const getCalendar = (date: Date): Array<Date> => {
    const controls: { [key: string]: Function } = {
      day: getWeekDays,
      week: getCalendarWeek,
      month: getCalendarMonth
    }
    const mode = nextMode.value || 'week'
    return controls[mode](date)
  }

  const checkWeek = () => {
    selectedDateRange.value = getCalendar(new Date())
  }

  watch(nextMode, checkWeek, { immediate: true })

  // Day
  const selectedDay = ref(startOfDay(props.initialDate || new Date()))
  const setDay = (value: Date) => {
    const newDate = value || selectedDay.value
    selectedDay.value = startOfDay(newDate)
  }

  watch(
    () => selectedDay.value,
    () => {
      selectedDateRange.value = getCalendar(selectedDay.value)
    }
  )

  // controls
  const next = () => {
    const addMethod: DateOperation = addMethods[nextMode.value]
    const date = addMethod(selectedDay.value, 1)
    setDay(date)
  }

  const previous = () => {
    const subMethod: DateOperation = subMethods[nextMode.value]
    const date = subMethod(selectedDay.value, 1)
    setDay(date)
  }

  checkWeek()

  return {
    // state
    selectedDay,
    selectedDateRange,
    startDate: selectedDateRange.value[0],
    endDate: selectedDateRange.value[selectedDateRange.value.length - 1],

    // methods
    controls: {
      setWeek,
      setDay,
      previous,
      next
    }
  }
}
