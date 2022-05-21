import { useGet } from 'lib/useAxios'
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner'
const RestaurantInfo = () => {
  const { query } = useRouter()
  const { data: restaurant, loading, error } = useGet(`/api/restaurants/${query.id}`)
  if (!restaurant || loading) return <Spinner />
  return (
    <div className='mb-8'>
      <h1 className='text-3xl font-bold'>{restaurant.name}</h1>
    </div>
  )
}

export default RestaurantInfo
