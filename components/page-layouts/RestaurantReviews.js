import { useRouter } from 'next/router'
import React from 'react'
import { useGet } from '../../lib/useAxios'
import Spinner from 'components/Spinner'
import ReviewCard from '../ReviewCard'
import { Edit3 } from 'react-feather'
import ReactSelect from 'react-select'

const ReviewStats = ({ reviews }) => {
  return (
    <div className='mb-5  rounded'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <h2 className='pl-1 text-xl font-bold mr-3'>{reviews.length} avis</h2>
          <div className='flex items-center underline text-md text-gray-600 font-bold'>
            <Edit3 size={20} className='mr-1' />
            Laissez le vôtre
          </div>
        </div>
        <div className='flex'>
          <ReactSelect placeholder='trier par' options={[]} />
          <ReactSelect placeholder='langue' options={[]} className='ml-3' />
        </div>
      </div>
    </div>
  )
}
const RestaurantReviews = () => {
  const { query } = useRouter()
  const { data: reviews, loading, error } = useGet(`/api/restaurants/${query.id}/reviews`)

  if (loading) return <Spinner />

  return (
    <div className='p-5 pt-8'>
      <ReviewStats reviews={reviews} />

      {reviews.map((r) => (
        <ReviewCard key={r._id} review={r} />
      ))}
    </div>
  )
}

export default RestaurantReviews
