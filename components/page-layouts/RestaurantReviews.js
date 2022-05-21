import { useRouter } from 'next/router'
import React from 'react'
import { useGet } from '../../lib/useAxios'
import Spinner from 'components/Spinner'

const RestaurantReviews = () => {
  const { query } = useRouter()
  const { data: reviews, loading, error } = useGet(`/api/restaurants/${query.id}/reviews`)

  if (loading) return <Spinner />
  return (
    <div>
      RestaurantReviews
      {reviews.map((r) => (
        <div key={r._id} className='border p-3 rounded mb-3'>
          <div>Rating: {r.rating}/10</div>
          <div>
            User: {r.user.firstName} {r.user.lastName}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RestaurantReviews
