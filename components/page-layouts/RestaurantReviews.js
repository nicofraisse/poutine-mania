import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useGet } from '../../lib/useAxios'
import Spinner from 'components/Spinner'
import ReviewCard from '../ReviewCard'
import { Edit3 } from 'react-feather'
import ReactSelect from 'react-select'
import { useRateRestaurant } from 'components/context/RateRestaurantProvider'

const ReviewStats = ({ reviews, restaurant }) => {
  const { rateRestaurant } = useRateRestaurant()
  return (
    <div className='mb-5  rounded'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <h2 className='pl-1 text-xl font-bold mr-3'>{reviews.length} avis</h2>
          <button
            onClick={() => rateRestaurant(restaurant)}
            className='flex items-center underline text-md text-gray-600 font-bold hover:bg-gray-100 p-2 rounded-lg select-none'
          >
            <Edit3 size={20} className='mr-1' />
            Notez leur poutine
          </button>
        </div>
        <div className='flex'>
          <ReactSelect placeholder='trier par' options={[]} />
          <ReactSelect placeholder='langue' options={[]} className='ml-3' />
        </div>
      </div>
    </div>
  )
}

const RestaurantReviews = ({ restaurant }) => {
  const { data: reviews, loading, error } = useGet(`/api/restaurants/${restaurant._id}/reviews`)

  if (loading) return <Spinner />

  return (
    <div className='p-5 pt-8'>
      <ReviewStats reviews={reviews} restaurant={restaurant} />

      {reviews.map((r) => (
        <ReviewCard key={r._id} review={r} />
      ))}
    </div>
  )
}

export default RestaurantReviews
