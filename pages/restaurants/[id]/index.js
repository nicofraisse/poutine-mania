import { useGet } from 'lib/useAxios'
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner'
import RestaurantReviews from 'components/page-layouts/RestaurantReviews'
import RestaurantHeader from 'components/RestaurantHeader'
import { ExternalLink, MapPin, Phone, PhoneCall } from 'react-feather'
import Map from 'components/Map'
import { useEffect, useState } from 'react'
import { formatAddress } from 'lib/formatAddress'

const Index = () => {
  const { query } = useRouter()
  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, { skip: !query.id })
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    setShowMap(window?.innerWidth >= 1280)

    window.addEventListener('resize', () => {
      if (window.innerWidth < 1280) {
        setShowMap(false)
      } else {
        setShowMap(true)
      }
    })
  }, [])

  if (!restaurant || loading) return <Spinner />
  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
      <div className='flex flex-col-reverse xl:flex-row'>
        <div className='lg:basis-2/3'>
          <RestaurantReviews restaurant={restaurant} />
        </div>
        <div className='xl:w-1/3 xl:sticky xl:top-4 xl:h-full p-4 xl:p-6 xl:pl-4'>
          <div className='border text-sm p-4 rounded-lg'>
            {restaurant.website && (
              <div className='mb-4 flex items-center'>
                <ExternalLink className='mr-2 inline shrink-0' size={20} />
                <a target='_blank' href={restaurant.website} className='underline' rel='noreferrer'>
                  {restaurant.website}
                </a>
              </div>
            )}
            {restaurant.phoneNumber && (
              <div className='mb-4 flex items-center'>
                <PhoneCall className='mr-2 inline shrink-0' size={20} />
                <span>{restaurant.phoneNumber}</span>
              </div>
            )}
            <div className='mb-2 flex items-center'>
              <MapPin className='mr-2 inline shrink-0' size={20} />
              <span>{formatAddress(restaurant)}</span>
            </div>
            <div className='underline block xl:hidden' onClick={() => setShowMap(!showMap)}>
              {showMap ? 'Cacher' : 'Voir sur'} la carte
            </div>
            {showMap && (
              <div className='border h-[300px]'>
                <Map restaurants={[restaurant]} isShowPage />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
