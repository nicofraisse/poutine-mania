import { useState } from 'react'
import axios from 'axios'

import { Check, ChevronLeft, ChevronRight, Edit3, Plus, X } from 'react-feather'

import Link from 'next/link'
import { useCurrentUser } from '../../lib/useCurrentUser'
import { useGet } from '../../lib/useAxios'
import toast from 'react-hot-toast'
import classNames from 'classnames'
import Spinner from '../Spinner'
import { formatRating } from '../../lib/formatRating'

const PublicProfile = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [formValues, setFormValues] = useState({})
  const [step, setStep] = useState(1)
  const [selectedTab, setSelectedTab] = useState('favorite')
  const { currentUser } = useCurrentUser()
  const { data: ratedRestaurants } = useGet(`api/users/${user?._id}/reviews`, {
    skip: !user,
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

  if (!user) return <Spinner />

  return (
    <div className='py-10'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-start justify-start mb-10 border bg-slate-100 p-4 rounded-xl'>
          <div className='w-32 h-32 rounded-full bg-gray-300 flex-shrink-0'></div>
          <div className='pl-10 w-full'>
            <div className='mb-1 w-full items-center justify-between flex'>
              <div className='font-black text-3xl'>
                {user.firstName} {user.lastName}
              </div>
              {user._id === currentUser?._id ? (
                <button className='text-base mx-3 px-4 py-1 rounded-lg text-gray-500 -mb-1 hover:text-gray-700 flex'>
                  <Edit3 className='mr-2' /> Modifier
                </button>
              ) : (
                <button className='text-base mx-3 bg-blue-400 px-4 py-1 rounded-lg text-white -mb-1 inline-block'>
                  Suivre
                </button>
              )}
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
            {r.restaurant.name}: {formatRating(r.rating)}/10
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
      {modalOpen && 'salute'}
    </div>
  )
}

export default PublicProfile
