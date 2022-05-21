import { useGet } from 'lib/useAxios'
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner'
import RestaurantInfo from 'components/page-layouts/RestaurantInfo'
import RestaurantReviews from 'components/page-layouts/RestaurantReviews'

const Index = () => {
  return (
    <div className='p-8'>
      <RestaurantInfo />
      <RestaurantReviews />
    </div>
  )
}

export default Index
