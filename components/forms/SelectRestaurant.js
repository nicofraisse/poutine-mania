import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'react-feather'
import { ratingColors } from '../../data/ratingColors'
import RatingPill from '../RatingPill'
import { round } from 'lodash'
import { formatRating } from '../../lib/formatRating'
import classNames from 'classnames'

const SelectRestaurant = ({ restaurants, onSelect, userRatedRestaurants }) => {
  console.log('res', restaurants)
  // console.log(userRatedRestaurants)

  return (
    <>
      {restaurants?.map((restaurant) => {
        const alreadyRated = userRatedRestaurants?.find(
          (review) => review.restaurantId === restaurant._id
        )
        return (
          <div
            key={restaurant._id}
            className={classNames(
              'border rounded p-3 hover:bg-gray-50 mb-2 cursor-pointer flex items-center justify-between',
              {
                'border-gray-50': !!alreadyRated,
              }
            )}
            onClick={() => onSelect(restaurant, alreadyRated)}
          >
            <div className={classNames({ 'text-gray-400': !!alreadyRated })}>{restaurant.name}</div>
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
              <div className='flex text-gray-400'>
                Sélectionner <ChevronRight />
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

export default SelectRestaurant
