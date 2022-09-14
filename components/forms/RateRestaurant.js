import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, Check } from 'react-feather'
import toast from 'react-hot-toast'
import { useGet } from '../../lib/useAxios'
import Button from '../Button'
import Form from 'components/Form'
import Field from 'components/Field'
import SelectRestaurant from './SelectRestaurant'
import Input from 'components/Input'
import * as Yup from 'yup'
import RatingButtons from '../controls/RatingButtons'
import ImageUpload from '../controls/ImageUpload'
import { useCurrentUser } from 'lib/useCurrentUser'
import Spinner from '../Spinner'

const RateRestaurant = ({
  onSubmit,
  preselectedRestaurant,
  existingReview,
  setExistingReview,
  setPreselectedRestaurant,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState(preselectedRestaurant || null)
  const [step, setStep] = useState(preselectedRestaurant?._id || existingReview ? 2 : 1)
  const { data: searchResults, loading: searchResultsLoading } = useGet(
    `/api/restaurants?search=${searchQuery}`
  )
  const { currentUser } = useCurrentUser()
  const { data: userReviews } = useGet(`/api/users/${currentUser?._id}/reviews`, {
    skip: !currentUser,
  })
  // const a = 3

  // console.log(userReviews)

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
    const publicId = await uploadToCloudinary(values.photos)
    const submitValues = {
      ...values,
      ...(publicId !== 'skip' && { photos: publicId ? [publicId] : null }),
      restaurantId: selectedRestaurant._id,
    }
    const url = existingReview ? `/api/reviews/${existingReview._id}/update` : '/api/reviews/create'
    const toastMessage = existingReview ? 'Modifié!' : 'Avis ajouté!'
    try {
      const data = await axios.post(url, submitValues)
      toast.success(toastMessage)
      // onSubmit(selectedRestaurant._id)
      setStep(3)
    } catch (e) {
      toast.error(e.message)
    }
  }

  console.log(currentUser)

  if (!userReviews) return <Spinner />

  if (step === 1) {
    return (
      <div className='sm:w-[560px] h-full sm:h-2/3vh  sm:px-3 flex flex-col justify-between'>
        <div className='font-bold text-xl'>Quelle poutine voulez-vous noter?</div>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type='text'
          className='font-bold text-sm'
          placeholder='Rechercher une poutine'
          isSearch
        />
        <div className='overflow-y-scroll' style={{ height: 'calc(100% - 200px)' }}>
          {searchResultsLoading ? (
            <Spinner />
          ) : (
            <SelectRestaurant
              restaurants={searchResults}
              userRatedRestaurants={userReviews}
              onSelect={(restaurant, alreadyRated) => {
                console.log({ alreadyRated })
                if (!!alreadyRated) {
                  setExistingReview(alreadyRated)
                  setPreselectedRestaurant(alreadyRated.restaurants[0])
                }
                setSelectedRestaurant(restaurant)
                setStep(2)
              }}
            />
          )}
        </div>

        <div className='text-right border-t-2 w-full bg-white h-20 p-3'>
          Restaurant introuvable?{' '}
          <span className='text-teal-600 hover:opacity-70'>
            <Link href='/admin/create-restaurant'>Ajouter un restaurant</Link>
          </span>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <Form
        initialValues={existingReview || { rating: null, title: '', comment: '', photos: [] }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          rating: Yup.number('Choisissez une note').min(0).max(10).required('Requis'),
          title: Yup.string().min(3),
          comment: Yup.string().min(5),
          photos: Yup.object().nullable(),
        })}
        className='sm:w-[560px] h-full  flex flex-col sm:px-3 pb-3'
      >
        {({ isSubmitting, values, errors }) => (
          <>
            <div className='font-bold text-xl mb-4 sm:mb-6'>
              {existingReview ? 'Modifier votre ' : 'Laissez un '}
              avis sur la poutine de{' '}
              <span className='font-black text-orange-800'>
                {selectedRestaurant.name || preselectedRestaurant.name}
              </span>
            </div>
            <div className='overflow-y-auto h-full'>
              <Field
                className='sm:mb-5'
                name='rating'
                label='Note sur 10'
                control={RatingButtons}
              />
              <Field className='sm:mb-5' name='title' label='Titre' />
              <Field className='sm:mb-5' name='comment' label='Commentaire' type='textarea' />
              <Field name='photos' control={ImageUpload} label='Photo' />
            </div>

            <div className='flex items-center justify-between mt-6'>
              {existingReview ? (
                <div></div>
              ) : (
                <button
                  className='flex items-center rounded text-gray-400 hover:text-gray-700'
                  onClick={() => {
                    setStep(1)
                  }}
                >
                  <ChevronLeft className='mr-2' size={20} />
                  Noter un autre restaurant
                </button>
              )}

              <Button type='submit' variant='primary' className='w-60' loading={isSubmitting}>
                {existingReview ? 'Mettre à jour' : 'Soumettre'}
              </Button>
            </div>
          </>
        )}
      </Form>
    )
  }
  if (step === 3) {
    return (
      <div className='sm:w-[560px] h-full flex flex-col items-center justify-center sm:px-3 pb-3 text-center'>
        <div className='flex items-center justify-center border-4 border-green-400 w-20 h-20 rounded-full'>
          <Check className='text-green-400 -mb-1' size={56} />
        </div>
        <div className='mt-4 mb-2 font-bold text-2xl'>Avis ajouté!</div>
        <div className='text-gray-500 px-3'>
          Merci {currentUser.firstName} d&apos;avoir noté la poutine de {selectedRestaurant.name}.
          Votre avis compte! Chaque review que tu écris aide la communauté à trouver les meilleures
          poutine locales.
        </div>
        <div className='mt-8 flex'>
          {/* <Button variant='white' width='lg' className='mr-4'>
            Voir l&apos;avis
          </Button> */}
          <Button variant='secondary' width='sm' type='button' onClick={() => setStep(1)}>
            Noter une autre poutine
          </Button>
        </div>
      </div>
    )
  }
}

export default RateRestaurant
