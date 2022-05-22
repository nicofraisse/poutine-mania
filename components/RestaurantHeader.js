import React from 'react'
import RatingPill from 'components/RatingPill'

const RestaurantHeader = ({ restaurant }) => {
  console.log(restaurant)
  return (
    <div className='relative' style={{ height: '17vw' }}>
      <div className='flex w-full h-full'>
        <div className='w-1/3 bg-gray-200 flex items-center justify-center border border-gray-400'>
          photo
        </div>
        <div className='w-1/3 bg-gray-200 flex items-center justify-center border border-gray-400'>
          photo
        </div>
        <div className='w-1/3 bg-gray-200 flex items-center justify-center border border-gray-400'>
          photo
        </div>
      </div>
      <div className='absolute top-0 h-full w-full flex items-center justify-center'>
        <div
          className='bg-white p-5 border-8 shadow-xl border-orange-200'
          style={{ width: 'calc(0.5 * (100vw))', maxWidth: 600 }}
        >
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>{restaurant.name}</h1>

            <RatingPill avgRating={restaurant.avgRating} reviewCount={restaurant.reviewCount} />
          </div>
          <div className='mt-2'>Restaurant à Frankfurt • $$ • 6.0/10 (2 avis)</div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantHeader
