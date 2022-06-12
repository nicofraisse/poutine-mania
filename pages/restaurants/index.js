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
import ReactSelect from 'react-select'

const sortTypes = [
  { label: 'Nom', value: 'name' },
  { label: 'Note moyenne', value: 'avgRating' },
  // { label: 'Date de création', value: 'createdAt' },
  { label: "Nombre d'avis", value: 'reviewCount' },
  // { label: 'Proximité', value: 'proximity' },
]

const sortOrders = [
  { label: 'Croissant', value: 1 },
  { label: 'Décroissant', value: -1 },
]

const Restaurants = () => {
  const { searchValue, nonDebouncedValue } = useRestaurantSearch()
  const [sortType, setSortType] = useState('reviewCount')
  const [sortOrder, setSortOrder] = useState(-1)

  const trimmedSearchValue = searchValue?.trim()
  const searchQuery = trimmedSearchValue ? `?search=${trimmedSearchValue}` : ''
  const sortTypeQuery = sortType ? `?sort=${sortType}` : ''
  const sortOrderQuery = sortOrder ? `&order=${sortOrder}` : ''

  const { data: restaurants, loading: restaurantsLoading } = useGet(
    `/api/restaurants${searchQuery}${sortTypeQuery}${sortOrderQuery}`
  )

  if (!restaurants) return <Spinner />

  const loading = searchValue !== nonDebouncedValue || restaurantsLoading

  return (
    <RestaurantCardHoverProvider>
      <div className='flex w-full flex-col md:flex-row-reverse h-screen-minus-navbar overflow-y-auto'>
        <div className='grow w-screen md:w-1/2 min-h-2/3vh max-h-2/3vh md:min-h-screen-minus-navbar md:max-h-screen-minus-navbar'>
          <Map restaurants={restaurants} />
        </div>
        <div className='pt-5 w-screen md:w-1/2 md:max-w-[560px] md:overflow-y-auto'>
          <div className='min-h-12'>
            <div className='flex flex-wrap items-center justify-between lg:pl-6 lg:pr-5 px-2 m b-3 lg:mb-0'>
              {loading ? (
                <div className=' mt-[-10px]'>
                  <Spinner />
                </div>
              ) : (
                restaurants.length === 0 && (
                  <h2 className='font-bold text-gray-500 text-xl flex items-center mr-2'>
                    {restaurants.length} résultat{restaurants.length > 1 && 's'}
                  </h2>
                )
              )}

              <div className='flex items-center'>
                <div className='text-sm font-bold text-gray-500 mr-2'>Tri par</div>
                <ReactSelect
                  placeholder='Trier par...'
                  options={sortTypes}
                  className='mr-2 text-sm'
                  onChange={({ value }) => setSortType(value)}
                  defaultValue={{ label: "Nombre d'avis", value: 'avgRating' }}
                />
                <ReactSelect
                  placeholder='Ordre'
                  options={sortOrders}
                  className='text-sm'
                  onChange={({ value }) => setSortOrder(value)}
                  defaultValue={{ label: 'Décroissant', value: -1 }}
                />
              </div>
            </div>
          </div>
          {restaurants?.map((r) => (
            <div className='px-1 lg:px-4 block' key={r._id}>
              <Link href={`/restaurants/${r._id}`} passHref>
                <a rel='noopener noreferrer'>
                  <RestaurantCard restaurant={r} />
                </a>
              </Link>
              <div className='w-full border-b'></div>
            </div>
          ))}
        </div>
      </div>
    </RestaurantCardHoverProvider>
  )
}

export default Restaurants
