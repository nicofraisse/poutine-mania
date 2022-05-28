import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useGet } from '../../lib/useAxios'
import Spinner from 'components/Spinner'
import ReviewCard from '../ReviewCard'
import { Camera, Edit3 } from 'react-feather'
import ReactSelect from 'react-select'
import { useRateRestaurant } from 'components/context/RateRestaurantProvider'
import axios from 'axios'
import toast from 'react-hot-toast'
import Button from 'components/Button'

const ReviewStats = ({ reviews, restaurant }) => {
  const { rateRestaurant } = useRateRestaurant()
  return (
    <div className='mb-5  rounded'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <h2 className='pl-1 text-xl font-bold mr-5 '>
            {reviews.length > 0
              ? `${reviews.length} avis`
              : 'Soyez la première personne à laisser un avis!'}
          </h2>
          {/* <ReactSelect placeholder='trier par' options={[]} /> */}
          {/* <ReactSelect placeholder='langue' options={[]} className='ml-3' /> */}
        </div>
        <div className='flex wrap items-center'>
          <div className='w-48'>
            <Button
              size='sm'
              onClick={() => rateRestaurant(restaurant)}
              className='flex items-center'
            >
              <Edit3 size={20} className='mr-1' />
              Noter leur poutine
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const RestaurantReviews = ({ restaurant }) => {
  const { data: reviews, loading, error } = useGet(`/api/restaurants/${restaurant._id}/reviews`)
  const { reload } = useRouter()
  const { rateRestaurant } = useRateRestaurant()

  if (loading) return <Spinner />

  const handleEdit = (review) => {
    rateRestaurant(restaurant, review)
  }

  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr(e) de vouloir supprimer l'avis? Cette action est irréversible.")
    ) {
      await axios
        .delete(`/api/reviews/${id}/delete`)
        .then(() => {
          toast.success('Supprimé!')
          reload(window.location.pathname)
        })
        .catch((e) => toast.error(e.message))
    }
  }

  return (
    <div className='p-2 lg:p-5 pt-8'>
      <ReviewStats reviews={reviews} restaurant={restaurant} />

      {reviews.map((r) => (
        <ReviewCard key={r._id} review={r} handleEdit={handleEdit} handleDelete={handleDelete} />
      ))}
    </div>
  )
}

export default RestaurantReviews
