import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, X } from 'react-feather'
import toast from 'react-hot-toast'
import { useGet } from '../../lib/useAxios'
import Button from '../Button'
import ReactSlider from 'react-slider'

const getSmiley = (value) => {
  if (value < 1) {
    return '🤮'
  } else if (value <= 1) {
    return '🤢'
  } else if (value <= 3) {
    return '😠'
  } else if (value <= 4) {
    return '😑'
  } else if (value <= 6) {
    return '😐'
  } else if (value <= 8) {
    return '🙂'
  } else if (value <= 9) {
    return '😊'
  } else {
    return '😍'
  }
}

const RateRestaurant = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [step, setStep] = useState(1)

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
        {searchResults?.map((result) => (
          <div
            key={result._id}
            className='border rounded p-3 hover:bg-gray-50 mb-2 cursor-pointer flex items-center justify-between'
            onClick={() => {
              setSelectedRestaurant(result)
              setStep(2)
            }}
          >
            <div>{result.name}</div>
            <div className='flex text-gray-400'>
              Sélectionner <ChevronRight />
            </div>
          </div>
        ))}
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
      <div className='w-[600px] pb-20 h-[400px]'>
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
      </div>
    )
  }
}

export default RateRestaurant
