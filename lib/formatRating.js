import { round } from 'lodash'

export const formatRating = (rating) => round(rating, 1)
