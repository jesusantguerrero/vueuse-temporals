import { format } from 'date-fns'

export const isSameDate = (date1: Date | null, date2: Date | null) => {
  try {
    return date1 && date2 && format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd')
  } catch (e) {
    return false
  }
}
