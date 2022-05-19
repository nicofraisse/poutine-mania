import classes from './starting-page.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

import { useSession } from 'next-auth/client'
import { Check, ChevronLeft, ChevronRight, Plus, X } from 'react-feather'

import Link from 'next/link'

function StartingPageContent() {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [session, loading] = useSession()
  const [formValues, setFormValues] = useState({})
  const [step, setStep] = useState(1)
  const [ratedRestaurants, setRatedRestaurants] = useState(null)

  useEffect(
    () =>
      axios
        .post('/api/restaurants/search', { query: 'p' })
        .then(({ data }) => setSearchResults(data))
        .catch((e) => console.log('err', e)),
    []
  )

  useEffect(() => {
    if (session) {
      axios
        .get(`api/users/${session._id}/reviews`)
        .then(({ data }) => {
          console.log('data', data)
          setRatedRestaurants(data)
        })
        .catch((e) => console.log('err', e))
    }
  }, [session])

  const handleChange = (e) => {
    setSearchValue(e.target.value)
    axios
      .post('/api/restaurants/search', { query: e.target.value })
      .then(({ data }) => setSearchResults(data))
      .catch((e) => console.log('err', e))
  }

  const handleSubmit = async () => {
    setModalOpen(false)
    await axios
      .post('/api/reviews/create', {
        ...formValues,
        restaurantId: selectedRestaurant._id,
      })
      .then((data) => console.log('ok', data))
      .catch((e) => console.log('err', e))
  }

  return (
    <div className='py-10'>
      <div className='w-2/3 mx-auto'>
        <div className='flex items-start justify-start mb-10'>
          <div className='w-32 h-32 rounded-full bg-gray-300 flex-shrink-0'></div>
          <div className='pl-10'>
            <div className='font-black text-4xl'>Jean-Luc Tremblay</div>
            <div className='text-sm text-gray-700 mt-2'>
              ldfsklj sdlkfaj asldawerlakwe knenaelmkeal alaawwo e avawec o ldfsklj sdlkfaj
              asldawerlakwe knenaelmkeal alaawwo e avawec o ldfsklj sdlkfaj asldawerlakwe
              knenaelmkeal alaawwo e avawec o ldfsklj sdlkfaj asldawerlakwe knenaelmkeal alaawwo e
              avawec o ldfsklj sdlkfaj
            </div>
          </div>
        </div>

        {ratedRestaurants?.map((r, i) => (
          <div
            key={i}
            className='border rounded my-2 p-6 text-gray-400 flex items-center cursor-pointer hover:bg-gray-50 flex-wrap-reverse break-all'
            // onClick={() => setModalOpen(true)}
          >
            {JSON.stringify(r)}
          </div>
        ))}
        {[...Array(1)].map((e, i) => (
          <div
            key={i}
            className='border rounded my-2 p-6 text-gray-400 flex items-center cursor-pointer hover:bg-gray-50'
            onClick={() => setModalOpen(true)}
          >
            <Plus size={32} className='mr-4' />
            Ajouter une poutine
          </div>
        ))}
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
                  onChange={handleChange}
                  value={searchValue}
                  className='border block my-2 p-1 rounded'
                />
                {searchResults.map((result) => (
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

export default StartingPageContent
