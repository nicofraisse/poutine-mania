import React from 'react'
import RatingPill from 'components/RatingPill'
import { Image as ImageIcon } from 'react-feather'
import { repeat, flatten } from 'lodash'
import { Image } from './Image'
import { TagSection } from './RestaurantCard'

const RestaurantHeader = ({ restaurant }) => {
  const city = restaurant?.succursales[0].address?.context?.find((el) =>
    el.id?.includes('place')
  )?.text

  const images = flatten(restaurant.reviews.map((r) => r.photos)).filter(Boolean)

  return (
    <div className='relative h-1/3vw sm:h-1/4vw lg:h-1/5vw 2xl:h-1/6vw'>
      <div className='flex w-full h-full'>
        <div className='w-1/3 bg-gray-100 flex items-center justify-center border-r-2 border-gray-50'>
          {images[0] ? (
            <Image
              publicId={images[0]}
              className='w-full h-full object-cover object-center'
              alt='restaurant-main-image-1'
            />
          ) : (
            <ImageIcon className='text-gray-300' size='80' alt='default' />
          )}
        </div>
        <div className='w-1/3 bg-gray-100 flex items-center justify-center border-r-2 border-gray-50'>
          {images[1] ? (
            <Image
              publicId={images[1]}
              className='w-full h-full object-cover object-center'
              alt='restaurant-main-image-2'
            />
          ) : (
            <ImageIcon className='text-gray-300' size='80' alt='default' />
          )}
        </div>
        <div className='w-1/3 bg-gray-100 flex items-center justify-center'>
          {images[2] ? (
            <Image
              publicId={images[2]}
              className='w-full h-full object-cover object-center'
              alt='restaurant-main-image-3'
            />
          ) : (
            <ImageIcon className='text-gray-300' size='80' alt='default' />
          )}{' '}
        </div>
      </div>
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#000000bb] flex items-end text-center'>
        <div className='p-2 md:pl-5 md:pb-3 w-full'>
          <div className='flex justify-between items-center text-white'>
            <h1
              className='text-xl md:text-3xl xl:text-5xl font-bold text-white text-center'
              style={{ textShadow: '0px 0px 6px rgba(0, 0, 0, 0.6)' }}
            >
              {restaurant.name}
            </h1>
          </div>
          <div className='mt-1 xl:mt-2'>
            {/* <span className='mr-1'>
              {`${restaurant.categories[0]} à ${city} •`}{' '}
              {restaurant.priceRange && `${repeat('$', restaurant.priceRange)}	• `}
            </span> */}
            <RatingPill avgRating={restaurant.avgRating} isNew isDarkBackground />
            <div className='text-left mb-1 mt-1'>
              <TagSection
                succursales={restaurant.succursales}
                categories={restaurant.categories}
                city={
                  restaurant.succursales[0].address?.context?.find((el) =>
                    el.id?.includes('neighborhood')
                  )?.text
                }
                priceRange={restaurant.priceRange}
                darkBackground
                largeText
                noAddress
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantHeader
