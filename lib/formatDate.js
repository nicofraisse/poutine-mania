import { format } from 'date-fns'

export const formatDate = (date, options) => {
  if (!date) return ''
  return format(new Date(date), options)
}
