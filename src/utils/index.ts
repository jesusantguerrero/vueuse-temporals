import { addDays, addMonths, addWeeks, addYears, subDays, subMonths, subWeeks, subYears } from 'date-fns'
export type DateOperation = (date: number | Date, amount: number) => Date

export const addMethods: Record<string, DateOperation> = {
  day: addDays,
  week: addWeeks,
  months: addMonths,
  year: addYears
}

export const subMethods: Record<string, DateOperation> = {
  day: subDays,
  week: subWeeks,
  months: subMonths,
  year: subYears
}
