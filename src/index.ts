/* eslint-disable no-console */
import { isLastDayOfMonth, isSameMonth } from 'date-fns'
import startOfDay from 'date-fns/startOfDay'
import { computed, ref, unref, watch } from 'vue'
import { isSameDate } from './utils'

interface Props {
  nextMode: string
  initialDate?: Date
}

export const PAGER_MODES = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
}
export const useDatePager = (props: Props) => {
  const nextMode = ref(props.nextMode)

  // Utils
  const getWeekDays = (date: Date): Array<Date> => {
    const firstDate = new Date(date.setDate(date.getDate() - 4))
    const week: Array<Date> = []
    for (let i = 0; i < 7; i++) {
      firstDate.setDate(firstDate.getDate() + 1)
      week.push(startOfDay(new Date(firstDate)))
    }
    return week
  }

  // state
  const firstDayOfWeek = ref(0)

  // Date Span
  const selectedSpan = ref()

  const setDateSpan = (value: Array<Date>): void => {
    selectedSpan.value = value || selectedSpan.value
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
    return controls[mode](new Date(date))
  }

  // Day
  const selectedDay = ref()
  const checkDateSpan = () => {
    setDateSpan(getCalendar(selectedDay.value))
  }
  const setDay = (value: Date) => {
    if (!isSameDate(unref(selectedDay), value)) {
      selectedDay.value = startOfDay(value || selectedDay.value)
      checkDateSpan()
    }
  }
  setDay(props.initialDate || new Date())

  watch(
    selectedDay,
    (newValue, oldValue) => {
      if (
        (nextMode.value === 'day' && !isSameDate(newValue, oldValue)) ||
        (nextMode.value === 'month' && !isSameMonth(newValue, oldValue))
      ) {
        checkDateSpan()
      }
    },
    { immediate: true }
  )

  watch(nextMode, checkDateSpan, { immediate: true })

  // controls
  const next = () => {
    const dayIndex = nextMode.value === PAGER_MODES.DAY ? 3 : selectedSpan.value.length - 1
    const oldSpan = unref(selectedSpan)
    const date = new Date(oldSpan[dayIndex].setDate(oldSpan[dayIndex].getDate() + 1))
    setDay(date)
  }

  const previous = () => {
    const dayIndex = nextMode.value === PAGER_MODES.DAY ? 3 : 0
    const oldSpan = unref(selectedSpan)
    const date = new Date(oldSpan[dayIndex].setDate(oldSpan[dayIndex].getDate() - 1))
    setDay(date)
  }

  return {
    // state
    selectedDay,
    selectedSpan,
    startDate: computed(() => selectedSpan.value && selectedSpan.value[0]),
    endDate: computed(() => selectedSpan.value && selectedSpan.value[selectedSpan.value.length - 1]),

    // methods
    controls: {
      setDateSpan,
      setDay,
      previous,
      next
    }
  }
}
