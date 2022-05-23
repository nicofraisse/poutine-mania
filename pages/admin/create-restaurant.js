import RestaurantForm from 'components/forms/Restaurant'
import { useRouter } from 'next/router'
import { useCurrentUser } from 'lib/useCurrentUser'
import Spinner from '../../components/Spinner'

const CreateRestaurant = () => {
  const { push } = useRouter()
  const { currentUser, loading } = useCurrentUser()
  if (loading) return <Spinner />
  if (!currentUser || !currentUser.isAdmin)
    return (
      <div className='p-2 text-red-500'>
        Vous devez être administrateur pour accéder cette page.
      </div>
    )
  return (
    <div className='w-[600px] py-10 px-16'>
      <h1 className='my-4 text-2xl'>Nouveau Restaurant</h1>
      <RestaurantForm type='create' onSubmit={() => push('/admin/restaurants')} />
    </div>
  )
}

export default CreateRestaurant
