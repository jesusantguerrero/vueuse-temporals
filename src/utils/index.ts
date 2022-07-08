import { format } from 'date-fns'

export const ISO_FORMAT = 'yyyy-MM-dd'
export const isSameDate = (date1: Date | null, date2: Date | null) => {
  try {
    return date1 && date2 && format(date1, ISO_FORMAT) === format(date2, ISO_FORMAT)
  } catch (e) {
    return false
  }
}

export const isDateIn = (date1: Date, dateArray: Date[]) => {
  return dateArray.map(day => format(day, ISO_FORMAT)).includes(format(date1, ISO_FORMAT))
}
