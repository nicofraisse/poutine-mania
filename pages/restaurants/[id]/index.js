import { useGet } from 'lib/useAxios'
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner'
import RestaurantReviews from 'components/page-layouts/RestaurantReviews'
import RestaurantHeader from 'components/RestaurantHeader'
import { ExternalLink, MapPin, Phone, PhoneCall } from 'react-feather'
import Map from 'components/Map'

const Index = () => {
  const { query } = useRouter()
  const {
    data: restaurant,
    loading,
    error,
  } = useGet(`/api/restaurants/${query.id}`, { skip: !query.id })
  if (!restaurant || loading) return <Spinner />
  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
      <div className='flex flex-col-reverse lg:flex-row lg:h-screen'>
        <div className='lg:w-2/3'>
          <RestaurantReviews restaurant={restaurant} />
        </div>
        <div className='lg:w-1/3 lg:h-full p-4 lg:p-8 lg:pl-4'>
          <div className='lg:sticky lg:top-8 border text-sm p-4 rounded-lg'>
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
            <div className='mb-4 flex items-center'>
              <MapPin className='mr-2 inline shrink-0' size={20} />
              <span>
                {restaurant.succursales.length > 1
                  ? `${restaurant.succursales.length} addresses au Québec`
                  : restaurant.succursales.address[0].label}
              </span>
            </div>
            <div className='border h-[200px] lg:h-[300px]'>
              <Map restaurants={[restaurant]} isShowPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
