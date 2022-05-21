import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { useState, useEffect } from 'react'
import { Trash, Edit } from 'react-feather'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Spinner from '../../components/Spinner'

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  const { push, reload } = useRouter()

  useEffect(() => {
    axios
      .get('/api/restaurants')
      .then(({ data }) => {
        setLoading(false)
        setRestaurants(data)
      })
      .catch((err) => toast.error(err))
  }, [])

  if (loading) return <Spinner />

  if (!restaurants) return 'no restaurants'

  return (
    <div className='flex w-full h-screen-minus-navbar'>
      <div className='grow overflow-x-scroll pt-6 w-1/2'>
        {[...restaurants, ...restaurants, ...restaurants, ...restaurants].map((r) => (
          <Link
            key={r._id}
            className='px-3 pb-6'
            href={`/restaurants/${r._id}`}
            target='_blank'
            passHref
          >
            <a target='_blank' rel='noopener noreferrer' className='px-3 pb-6 block'>
              <div className='pb-6 border-b flex justify-between items-start'>
                <div className='bg-gray-200 rounded-lg w-1/4 h-24 mr-3'></div>
                <div className='w-3/4'>
                  <div className='flex justify-between'>
                    <div className='font-bold text-lg'>{r.name}</div>
                    <div className='px-2 bg-green-100 text-sm rounded flex items-center'>
                      <span className='font-bold mr-1'>6/10</span>
                      <span className='text-xs text-gray-600'> • 34 avis</span>
                    </div>
                  </div>
                  <div className='text-sm text-gray-500'>
                    10 rue de Castelneau, H3X 4L0 Montréal
                  </div>
                  <div className='text-ellipsis text-xs text-gray-500 mt-3'>
                    "...la poutine était vraiment excellente, miam. Les frites un peu sèches mais
                    quand même bonnes. Les frites un peu sèches mais quand..."{' '}
                    <span className='font-bold underline'>lire la suite</span>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div className='bg-blue-100 w-1/2'>Map</div>
    </div>
  )
}

export default Restaurants
