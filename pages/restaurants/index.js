import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { useState, useEffect } from 'react'
import { Trash, Edit } from 'react-feather'
import Link from 'next/link'

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
      .catch((err) => console.log(err))
  }, [])

  const handleDelete = async ({ _id, name }) => {
    if (window.confirm(`Êtes-vous sûr(e) de vouloir supprimer "${name}?"`)) {
      await axios
        .delete(`/api/restaurants/${_id}/delete`)
        .then(() => {
          console.log('deleted!')
          reload(window.location.pathname)
        })
        .catch((e) => console.log('err', e))
    }
  }

  if (loading || !restaurants) return 'loading'

  return (
    <div className='p-16'>
      <Link href='/create-restaurant'>Créer un restaurant</Link>

      {restaurants?.map((r) => (
        <div key={r._id} className='border rounded my-3 mx-auto p-5 flex justify-between'>
          <div>{r.name}</div>
          <div>
            <button
              className='p-1 bg-gray-200 rounded shadow hover:bg-gray-100 mx-2'
              onClick={() => push(`/restaurants/${r._id}/edit`)}
            >
              <Edit size={20} />
            </button>
            <button
              className='p-1 bg-gray-200 rounded shadow hover:bg-gray-100 mx-2'
              onClick={() => handleDelete(r)}
            >
              <Trash size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Restaurants
