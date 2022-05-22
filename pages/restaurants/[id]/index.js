import { useGet } from 'lib/useAxios'
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner'
import RestaurantReviews from 'components/page-layouts/RestaurantReviews'
import RestaurantHeader from 'components/RestaurantHeader'
import { ExternalLink, MapPin, Phone, PhoneCall } from 'react-feather'
import Map from 'components/Map'
const Index = () => {
  const { query } = useRouter()
  const { data: restaurant, loading, error } = useGet(`/api/restaurants/${query.id}`)
  if (!restaurant || loading) return <Spinner />
  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
      <div className='flex h-screen'>
        <div className='w-2/3'>
          <RestaurantReviews />
        </div>
        <div className='w-1/3 h-full p-8 pl-4'>
          <div className='sticky top-8 border text-sm p-4 rounded-lg'>
            <div className='mb-4'>
              <MapPin className='mr-2 inline' size={20} />
              <span>{restaurant.addresses[0].label}</span>
            </div>
            <div className='mb-4'>
              <PhoneCall className='mr-2 inline' size={20} />
              <span>+1 (514) 610-3238</span>
            </div>
            <div className='mb-4'>
              <ExternalLink className='mr-2 inline' size={20} />
              <a target='_blank' href='https://www.poutineville.ca' className='underline' rel="noreferrer">
                https://www.poutineville.ca
              </a>
            </div>
            <div className='border h-[300px]'>
              <Map restaurants={[restaurant]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
