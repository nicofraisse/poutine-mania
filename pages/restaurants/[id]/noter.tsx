import React, { useState } from 'react'
import axios from 'axios'
import { useGet } from 'lib/useAxios'
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner'
import Field from 'components/Field'
import { ratingColors } from '../../../data/ratingColors'
import RatingButtons from '../../../components/controls/RatingButtons'
import Button from '../../../components/Button'
import ImageUpload from '../../../components/controls/ImageUpload'
import * as Yup from 'yup'
import Form from '../../../components/Form'
import toast from 'react-hot-toast'
import Color from 'color'
import { round } from 'lodash'
import { formatRating } from '../../../lib/formatRating'
import { ChevronLeft, ChevronDown, ChevronUp, Plus, Minus, Check } from 'react-feather'
import classNames from 'classnames'

const NoterRestaurant = () => {
  const [showDetailedRatings, setShowDetailedRatings] = useState(false)
  const { query } = useRouter()

  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, { skip: !query.id })

  const uploadToCloudinary = async (files) => {
    if (!files || files.length === 0) return null
    if (typeof files?.[0] === 'string') return 'skip'
    const formData = new FormData()
    for (const file of files) {
      formData.append('file', file)
    }
    formData.append('upload_preset', 'bsmn0mmd')
    const { data } = await axios.post(
      'https://api.cloudinary.com/v1_1/dhqv0jl8c/image/upload',
      formData
    )
    return data.public_id
  }

  const handleSubmit = async (values) => {
    // Temp
    const existingReview = null
    const publicId = await uploadToCloudinary(values.photos)
    const submitValues = {
      ...values,
      ...(publicId !== 'skip' && { photos: publicId ? [publicId] : null }),
      restaurantId: restaurant._id,
    }
    const url = existingReview ? `/api/reviews/${existingReview._id}/update` : '/api/reviews/create'
    const toastMessage = existingReview ? 'Modifié!' : 'Avis ajouté!'
    try {
      const data = await axios.post(url, submitValues)
      toast.success(toastMessage)
      // onSubmit(restaurant._id)
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (loading || !restaurant) return <Spinner />
  return (
    <div className='p-4'>
      <h1 className='text-xl font-black mb-2'>
        Noter <span>{restaurant.name}</span>
      </h1>

      <Form
        initialValues={{
          rating: null,
          friesRating: null,
          cheeseRating: null,
          sauceRating: null,
          serviceRating: null,
          title: '',
          comment: '',
          photos: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          // rating: Yup.number('Choisissez une note').min(0).max(10).required('Requis'),
          serviceRating: Yup.number('Choisissez une note').min(0).max(10).required('Requis'),
          friesRating: Yup.number('Choisissez une note').min(0).max(10).required('Requis'),
          cheeseRating: Yup.number('Choisissez une note').min(0).max(10).required('Requis'),
          sauceRating: Yup.number('Choisissez une note').min(0).max(10).required('Requis'),
          title: Yup.string().min(3),
          comment: Yup.string().min(5),
          photos: Yup.object().nullable(),
        })}
      >
        {({ isSubmitting, values, errors }) => {
          const nbFilledFields = [
            values.rating,
            values.serviceRating,
            values.friesRating,
            values.cheeseRating,
            values.sauceRating,
          ].filter((v) => v).length
          const avgRating =
            (values.serviceRating +
              values.friesRating +
              values.cheeseRating +
              values.sauceRating +
              values.rating) /
            nbFilledFields

          console.log([
            values.rating,
            values.serviceRating,
            values.friesRating,
            values.cheeseRating,
            values.sauceRating,
          ])
          return (
            <>
              <div className='font-bold text-xl mb-4 sm:mb-6'></div>

              <Field
                className='sm:mb-5'
                name='rating'
                label='Note globale'
                control={RatingButtons}
              />

              <div
                className={classNames({
                  block: showDetailedRatings,
                  hidden: !showDetailedRatings,
                })}
              >
                <Field
                  className='sm:mb-5'
                  name='friesRating'
                  label='Frites'
                  control={RatingButtons}
                />
                <Field
                  className='sm:mb-5'
                  name='cheeseRating'
                  label='Fromage'
                  control={RatingButtons}
                />
                <Field
                  className='sm:mb-5'
                  name='sauceRating'
                  label='Sauce'
                  control={RatingButtons}
                />
                <Field
                  className='sm:mb-5'
                  name='serviceRating'
                  label='Qualité/prix et service'
                  control={RatingButtons}
                />
              </div>

              <button
                onClick={() => setShowDetailedRatings(!showDetailedRatings)}
                className='text-sm my-3 flex items-center justify-center text-gray-400 px-6 py-1 border-2 border-gray-300 rounded-full'
                type='button'
              >
                {showDetailedRatings ? (
                  <Minus className='mr-1' size={20} />
                ) : (
                  <Plus className='mr-1' size={20} />
                )}
                {showDetailedRatings ? 'Masquer' : 'Plus de'} critères de notation
              </button>
              {avgRating > 0 && (
                <div className='flex items-center text-gray-500 border-gray-300 rounded my-6 bg-gray-100 p-6 justify-center'>
                  <div className='mr-2'>Votre note finale:</div>
                  <div>
                    <span
                      className='py-[2px] px-[8px] bg-green-200 rounded mr-2 text-xl sm:text-2xl text-white flex items-center font-bold shadow-lg'
                      style={{
                        backgroundColor: Color(ratingColors[round(avgRating)])
                          .darken(0.3)
                          .desaturate(0.3),
                      }}
                    >
                      {formatRating(avgRating) || '?'}
                      <span className='text-white font-normal text-sm sm:text-base text-opacity-80 ml-[2px] -mb-[2px]'>
                        /10
                      </span>
                    </span>
                  </div>
                </div>
              )}
              <Field className='sm:mb-5' name='comment' label='Commentaire' type='textarea' />
              <Field name='photos' control={ImageUpload} label='Photo' />
              <div className='flex items-center justify-center pt-6 pb-3  mt-6 border-t'>
                <Button type='submit' variant='primary' className='w-60' loading={isSubmitting}>
                  <Check className='mr-2' />
                  Terminer
                </Button>
              </div>
            </>
          )
        }}
      </Form>
    </div>
  )
}

export default NoterRestaurant
