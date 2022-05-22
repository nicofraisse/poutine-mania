import RestaurantForm from 'components/forms/Restaurant'
import { useRouter } from 'next/router'

const CreateRestaurant = () => {
  const { push } = useRouter()
  return (
    <div className='w-[600px] py-10 px-16'>
      <h1 className='my-4 text-2xl'>Nouveau Restaurant</h1>
      <RestaurantForm type='create' onSubmit={() => push('/admin/restaurants')} />
    </div>
  )
}

export default CreateRestaurant
