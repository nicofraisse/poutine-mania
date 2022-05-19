import { useState } from 'react'
import axios from 'axios'

import { Check, ChevronLeft, ChevronRight, Plus, X } from 'react-feather'

import Link from 'next/link'
import { useCurrentUser } from '../../lib/useCurrentUser'
import { useGet } from '../../lib/useAxios'
import toast from 'react-hot-toast'
import classNames from 'classnames'

function PublicProfile() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [formValues, setFormValues] = useState({})
  const [step, setStep] = useState(1)
  const [selectedTab, setSelectedTab] = useState('favorite')
  const { currentUser } = useCurrentUser()
  const { data: ratedRestaurants } = useGet(`api/users/${currentUser._id}/reviews`, {
    skip: !currentUser,
  })
  const { data: searchResults } = useGet(`/api/restaurants?search=${searchQuery}`)

  const handleSubmit = async () => {
    setModalOpen(false)
    await axios
      .post('/api/reviews/create', {
        ...formValues,
        restaurantId: selectedRestaurant._id,
      })
      .then(() => toast.success('Review created!'))
      .catch(() => toast.error('Error'))
  }

  return (
    <div className='py-10'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-start justify-start mb-10 border bg-slate-100 p-4 rounded-xl'>
          <div className='w-32 h-32 rounded-full bg-gray-300 flex-shrink-0'></div>
          <div className='pl-10 w-full'>
            <div className='mb-1 w-full items-center justify-between flex'>
              <div className='font-black text-3xl'>{currentUser.email}</div>
              <button className='text-base mx-3 bg-blue-400 px-4 py-1 rounded-lg text-white -mb-1 inline-block'>
                Suivre
              </button>
            </div>
            <div className='text-lg'>58 poutines notées | 12 abonnés </div>
          </div>
        </div>
        <div className='w-full flex font-bold'>
          <div
            onClick={() => setSelectedTab('favorite')}
            className={classNames(
              'py-2 px-5 text-lg rounded-full cursor-pointer flex-grow-1 flex items-center justify-center mr-3',
              {
                'bg-teal-400 font-bold text-white border-teal-400': selectedTab === 'favorite',
                'text-gray-400 border-gray-400 border bg-gray-50 hover:bg-gray-100':
                  selectedTab === 'all',
              }
            )}
          >
            Poutines préférées
          </div>
          <div
            onClick={() => setSelectedTab('all')}
            className={classNames(
              'py-2 px-5 text-lg rounded-full cursor-pointer flex-grow-1 flex items-center justify-center',
              {
                'bg-teal-400 font-bold text-white border-teal-400': selectedTab === 'all',
                'text-gray-400 border-gray-400 border bg-gray-50 hover:bg-gray-50':
                  selectedTab === 'favorite',
              }
            )}
          >
            Toutes les poutines notées
          </div>
        </div>
        {ratedRestaurants?.map((r, i) => (
          <div
            key={i}
            className='border rounded my-2 p-6 text-gray-400 flex items-center cursor-pointer hover:bg-gray-50 flex-wrap-reverse break-all'
          >
            {r.restaurant.name}: {r.rating}/10
          </div>
        ))}

        <div
          className='border rounded my-2 p-6 text-gray-400 flex items-center cursor-pointer hover:bg-gray-50'
          onClick={() => setModalOpen(true)}
        >
          <Plus size={32} className='mr-4' />
          Ajouter une poutine
        </div>
      </div>
      {modalOpen && (
        <div className='bg-black bg-opacity-25 fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>
          <div className='bg-white p-10 w-3/5 h-1/2 rounded-lg shadow-xl relative'>
            <X
              className='absolute top-6 right-6 hover:opacity-70 cursor-pointer'
              onClick={() => {
                setModalOpen(false)
                setStep(1)
              }}
            />
            {step === 1 && (
              <>
                <div className='font-bold text-xl'>Etape 1/2: Trouver une poutine</div>
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
                  Vous ne trouvez pas un restaurant?{' '}
                  <span className='text-blue-500 hover:opacity-70'>
                    <Link href='/create-restaurant'>Ajouter un restaurant</Link>
                  </span>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className='font-bold text-xl'>
                  Etape 2/2: Noter la poutine de{' '}
                  <span className='font-black text-orange-800'>{selectedRestaurant.name}</span>
                </div>
                <div className='h-2/3 flex flex-col items-center justify-center'>
                  <div className=' my-5'>
                    <input
                      type='number'
                      className='border p-2 text-xl mr-2'
                      min={0}
                      max={10}
                      value={formValues.rating}
                      onChange={(e) => setFormValues({ ...formValues, rating: e.target.value })}
                    />
                    sur 10
                  </div>
                </div>
                <button
                  className='flex items-center py-2 px-4 border rounded shadow-md text-gray-400 hover:text-gray-700 absolute bottom-8 left-8'
                  onClick={() => {
                    setStep(1)
                  }}
                >
                  <ChevronLeft className='mr-2' size={20} />
                  Noter un autre restaurant
                </button>
                <button
                  className='flex items-center py-2 px-4 border rounded shadow-md bg-green-200 hover:bg-green-300 absolute bottom-8 right-8'
                  onClick={handleSubmit}
                >
                  <Check className='mr-2' size={20} />
                  Valider
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicProfile
