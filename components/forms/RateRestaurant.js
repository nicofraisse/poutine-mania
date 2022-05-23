import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, X } from 'react-feather'
import toast from 'react-hot-toast'
import { useGet } from '../../lib/useAxios'
import Button from '../Button'
import ReactSlider from 'react-slider'
import { getSmiley } from 'lib/getSmiley'
import Form from 'components/Form'
import Field from 'components/Field'
import SelectRestaurant from './SelectRestaurant'
import * as Yup from 'yup'
import RatingButtons from '../controls/RatingButtons'

const RateRestaurant = ({ onSubmit, preselectedRestaurant, existingReview }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState(preselectedRestaurant || null)
  const [step, setStep] = useState(preselectedRestaurant?._id || existingReview ? 2 : 1)
  const { data: searchResults } = useGet(`/api/restaurants?search=${searchQuery}`)

  const handleSubmit = async (values) => {
    if (existingReview) {
      await axios
        .post(`/api/reviews/${existingReview._id}/update`, values)
        .then(() => {
          toast.success('Modifié!')
          onSubmit(selectedRestaurant._id)
        })
        .catch((e) => {
          toast.error(e.message)
        })
    } else {
      await axios
        .post('/api/reviews/create', {
          ...values,
          restaurantId: selectedRestaurant._id,
        })
        .then(() => {
          toast.success('Avis ajouté!')
          onSubmit(selectedRestaurant._id)
        })
        .catch(() => {
          toast.error('Error')
        })
    }
  }

  if (step === 1) {
    return (
      <div className='w-[600px] pb-20 h-[400px]'>
        <div className='font-bold text-xl'>Quelle poutine voulez-vous noter?</div>
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          className='border block my-2 p-1 rounded'
        />
        <SelectRestaurant
          restaurants={searchResults}
          onSelect={(restaurant) => {
            setSelectedRestaurant(restaurant)
            setStep(2)
          }}
        />
        <div className='text-right absolute bottom-8 right-8'>
          Restaurant introuvable?{' '}
          <span className='text-blue-500 hover:opacity-70'>
            <Link href='/create-restaurant'>Ajouter un restaurant</Link>
          </span>
        </div>
      </div>
    )
  }

  if (step === 2) {
    console.log('the existing', existingReview)
    return (
      <>
        <Form
          initialValues={
            { ...existingReview, title: ' hesck', comment: 'OK MAN' } || {
              rating: null,
              title: '',
              comment: '',
            }
          }
          onSubmit={handleSubmit}
          validationSchema={Yup.object({
            rating: Yup.number().min(0).max(10).required('Requis'),
            title: Yup.string().min(3),
            comment: Yup.string().min(5),
          })}
          className='w-[600px] p-4'
        >
          {({ isSubmitting, values }) => (
            <>
              {JSON.stringify(values)}
              <div className='font-bold text-xl mb-4'>
                {existingReview ? 'Modifier votre ' : 'Laissez un '}
                avis sur la poutine de{' '}
                <span className='font-black text-orange-800'>
                  {selectedRestaurant.name || preselectedRestaurant.name}
                </span>
              </div>
              <Field name='rating' label='Note sur 10' control={RatingButtons} />
              <Field name='title' label='Titre' />
              <Field name='comment' label='Commentaire' type='textarea' />
              <div className='flex items-center justify-between mt-6'>
                <button
                  className='flex items-center rounded text-gray-400 hover:text-gray-700'
                  onClick={() => {
                    setStep(1)
                  }}
                >
                  <ChevronLeft className='mr-2' size={20} />
                  Noter un autre restaurant
                </button>
                <Button type='submit' variant='primary' className='w-60' loading={isSubmitting}>
                  Soumettre
                </Button>
              </div>
            </>
          )}
        </Form>
      </>
    )
  }
}

export default RateRestaurant
