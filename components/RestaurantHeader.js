import React from 'react'
import RatingPill from 'components/RatingPill'
import { Image } from 'react-feather'
import { repeat } from 'lodash'

const RestaurantHeader = ({ restaurant }) => {
  const city = restaurant?.succursales[0].address?.context?.find((el) =>
    el.id?.includes('place')
  )?.text
  return (
    <div className='relative' style={{ height: '17vw' }}>
      <div className='flex w-full h-full'>
        <div className='w-1/3 bg-gray-100 flex items-center justify-center border-r-2 border-gray-50'>
          <Image className='text-gray-300' size='80' alt='default' />
        </div>
        <div className='w-1/3 bg-gray-100 flex items-center justify-center border-r-2 border-gray-50'>
          <Image className='text-gray-300' size='80' alt='default' />
        </div>
        <div className='w-1/3 bg-gray-100 flex items-center justify-center'>
          <Image className='text-gray-300' size='80' alt='default' />
        </div>
      </div>
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-500 flex items-end text-center'>
        <div className='p-2 lg:p-5 w-full'>
          <div className='flex justify-between items-center text-white'>
            <h1 className='text-lg lg:text-3xl font-bold text-white text-center'>
              {restaurant.name}
            </h1>
          </div>
          <div className='lg:mt-2 text-white flex items-center text-sm lg:text-base'>
            <span className='mr-1'>
              {`${restaurant.categories[0]} à ${city} •`}{' '}
              {restaurant.priceRange && `${repeat('$', restaurant.priceRange)}	• `}
            </span>
            <RatingPill avgRating={restaurant.avgRating} reviewCount={restaurant.reviewCount} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantHeader
