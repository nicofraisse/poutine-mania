import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'react-feather'

const SelectRestaurant = ({ restaurants, onSelect }) => {
  return (
    <>
      {restaurants?.map((restaurant) => (
        <div
          key={restaurant._id}
          className='border rounded p-3 hover:bg-gray-50 mb-2 cursor-pointer flex items-center justify-between'
          onClick={() => onSelect(restaurant)}
        >
          <div>{restaurant.name}</div>
          <div className='flex text-gray-400'>
            Sélectionner <ChevronRight />
          </div>
        </div>
      ))}
    </>
  )
}

export default SelectRestaurant
