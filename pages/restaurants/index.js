import axios from 'axios'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Spinner from 'components/Spinner'
import Map from 'components/Map'
import RestaurantCard from '../../components/RestaurantCard'
import { useRestaurantSearch } from 'components/context/RestaurantSearchProvider'
import { useGet } from 'lib/useAxios'
import { RestaurantCardHoverProvider } from 'components/context/RestaurantCardHoverProvider'

const Restaurants = () => {
  const { searchValue, nonDebouncedValue } = useRestaurantSearch()

  const trimmedSearchValue = searchValue?.trim()
  const { data: restaurants, loading: restaurantsLoading } = useGet(
    `/api/restaurants${trimmedSearchValue ? `?search=${trimmedSearchValue}` : ''}`
  )
  if (!restaurants) return <Spinner />

  const loading = searchValue !== nonDebouncedValue || restaurantsLoading

  return (
    <RestaurantCardHoverProvider>
      <div className='flex w-full h-screen-minus-navbar'>
        <div className='pt-5 w-1/2 overflow-y-auto'>
          <div className='h-12'>
            {loading ? (
              <div className='absolute mt-[-10px]'>
                <Spinner />
              </div>
            ) : (
              <h2 className='font-bold text-gray-500 pl-6 text-xl flex items-center'>
                {restaurants.length} résultat{restaurants.length > 1 && 's'}
              </h2>
            )}
          </div>
          {restaurants?.map((r) => (
            <div className='px-1 lg:px-4 block' key={r._id}>
              <Link href={`/restaurants/${r._id}`} target='_blank' passHref>
                <a target='_blank' rel='noopener noreferrer'>
                  <RestaurantCard restaurant={r} />
                </a>
              </Link>
              <div className='w-full border-b'></div>
            </div>
          ))}
        </div>
        <div className='w-1/2'>
          <Map restaurants={restaurants} />
        </div>
      </div>
    </RestaurantCardHoverProvider>
  )
}

export default Restaurants
