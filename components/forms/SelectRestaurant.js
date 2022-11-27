import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'react-feather'
import { ratingColors } from '../../data/ratingColors'
import RatingPill from '../RatingPill'
import { round } from 'lodash'
import { formatRating } from '../../lib/formatRating'
import classNames from 'classnames'
import { formatAddress } from '../../lib/formatAddress'
import { Image } from 'components/Image'
import { useRouter } from 'next/router'

const SelectRestaurant = ({ restaurants, onSelect, userRatedRestaurants }) => {
  const { push } = useRouter()
  return (
    <>
      {restaurants?.map((restaurant) => {
        const alreadyRated = userRatedRestaurants?.find(
          (review) => review.restaurantId === restaurant._id
        )
        const image = restaurant.reviews?.find((r) => r.photos?.[0])?.photos[0]

        return (
          <Link key={restaurant._id} href={`/restaurants/${restaurant._id}/noter`} passHref>
            <div
              className={classNames(
                'border-t rounded p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between',
                {
                  'border-gray-50': !!alreadyRated,
                }
              )}
            >
              <div className='flex items-center'>
                <Image
                  publicId={image}
                  alt={`${restaurant.name}-photo`}
                  className='h-12 min-w-12 max-w-12 object-cover object-center rounded-sm'
                />
                <div className='pl-3'>
                  <div
                    className={classNames('font-bold text-sm', { 'text-gray-400': !!alreadyRated })}
                  >
                    {restaurant.name}
                  </div>
                  <div
                    className={classNames('text-xs text-gray-400', {
                      'text-gray-400': !!alreadyRated,
                    })}
                  >
                    {formatAddress(restaurant)}
                  </div>
                </div>
                {alreadyRated ? (
                  <div className='flex text-gray-400'>
                    Déjà noté{' '}
                    <div
                      className='px-1 bg-green-200 rounded mr-2 text-gray-700 text-sm font-bold flex items-center justify-center mx-2'
                      style={{ backgroundColor: ratingColors[round(alreadyRated.rating)] }}
                    >
                      {formatRating(alreadyRated.rating)}/10
                    </div>
                  </div>
                ) : (
                  <ChevronRight className='text-gray-300' />
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </>
  )
}

export default SelectRestaurant
