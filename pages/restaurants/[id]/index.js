import { useGet } from 'lib/useAxios'
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner'
import RestaurantReviews from 'components/page-layouts/RestaurantReviews'
import RestaurantHeader from 'components/RestaurantHeader'

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
        <div className='w-1/3 bg-red-50 h-full p-8'>
          <div className='sticky top-[160px] z-10'>HELLO</div>
        </div>
      </div>
    </div>
  )
}

export default Index
