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

const RateRestaurant = ({ onClose, preselectedRestaurant }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(preselectedRestaurant || null)
  const [formValues, setFormValues] = useState({})
  const [step, setStep] = useState(preselectedRestaurant ? 2 : 1)
  const { data: searchResults } = useGet(`/api/restaurants?search=${searchQuery}`)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await axios
      .post('/api/reviews/create', {
        ...formValues,
        restaurantId: selectedRestaurant._id,
      })
      .then(() => {
        toast.success('Review created!')
        setIsSubmitting(false)
        onClose()
      })
      .catch(() => {
        toast.error('Error')
        setIsSubmitting(false)
      })
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
    return (
      <>
        {/* <div className='w-[600px] pb-20 h-[400px]'>
          <div className='font-bold text-xl'>
            Laissez un avis sur la poutine de{' '}
            <span className='font-black text-orange-800'>{selectedRestaurant.name}</span>
          </div>

          <div className='w-3/4 mx-auto mt-20'>
            <div className='bg-zinc-300 h-3 rounded-full mb-[-30px]'></div>
            <ReactSlider
              min={0}
              max={10}
              defaultValue={6}
              onChange={(rating) => setFormValues({ ...formValues, rating })}
              renderThumb={(props) => (
                <div
                  {...props}
                  className='text-5xl cursor-pointer hover:transform hover:scale-125 transition duration-200'
                >
                  {getSmiley(formValues.rating)}
                </div>
              )}
            />
          </div>
          <div className='text-center mt-14 text-lg'>
            <span className='font-bold text-3xl mr-1'>{formValues.rating}</span>/ 10
          </div>

          <button
            className='flex items-center py-2 px-4 rounded text-gray-400 hover:text-gray-700 absolute bottom-10 left-8'
            onClick={() => {
              setStep(1)
            }}
          >
            <ChevronLeft className='mr-2' size={20} />
            Noter un autre restaurant
          </button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            className='flex items-center absolute bottom-8 right-8 w-40'
          >
            <Check className='mr-2' size={20} />
            Valider
          </Button>
        </div> */}

        <Form
          initialValues={{ email: '', password: '' }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object({
            email: Yup.string().min(1).required('Required'),
            password: Yup.string().min(1).required('Required'),
          })}
          className='w-[600px] p-4'
        >
          {({ isSubmitting }) => (
            <>
              <div className='flex'>
                <div className='grow'>
                  <Field
                    name='rating'
                    label='Note sur 10 (requis)'
                    type='number'
                    min={0}
                    max={10}
                  />
                  <Field name='title' label='Titre' type='text' />
                  <Field name='comment' label='Commentaire' type='textarea' />
                  <Button type='submit' variant='primary' className='mt-6' loading={isSubmitting}>
                    Noter
                  </Button>
                </div>
                <div className='flex w-1/6 justify-center'>
                  <div className='bg-zinc-300 h-full rounded-full w-3'></div>
                  <ReactSlider
                    min={0}
                    max={10}
                    invert={true}
                    orientation='vertical'
                    className='ml-[-30px]'
                    defaultValue={6}
                    onChange={(rating) => setFormValues({ ...formValues, rating })}
                    renderThumb={(props) => (
                      <div
                        {...props}
                        className='text-5xl cursor-pointer hover:transform hover:scale-125 transition duration-200'
                      >
                        {getSmiley(formValues.rating)}
                      </div>
                    )}
                  />
                </div>
                {/* <div className='text-center mt-14 text-lg'>
                  <span className='font-bold text-3xl mr-1'>{formValues.rating}</span>/ 10
                </div> */}
              </div>
            </>
          )}
        </Form>
      </>
    )
  }
}

export default RateRestaurant
