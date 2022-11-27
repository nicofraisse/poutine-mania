import Link from 'next/link'
import { useState } from 'react'

import SelectRestaurant from 'components/forms/SelectRestaurant'
import Input from 'components/Input'

import { useCurrentUser } from 'lib/useCurrentUser'
import Spinner from 'components/Spinner'
import { useLoginForm } from 'components/context/LoginFormProvider'
import { userAgent } from '../node_modules/next/server'
import { useGet } from '../lib/useAxios'
import { useDebounce } from 'use-debounce'

const Noter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedValue] = useDebounce(searchQuery, 300)

  const { data: searchResults, loading: searchResultsLoading } = useGet(
    `/api/restaurants?search=${debouncedValue}`
  )
  const { currentUser } = useCurrentUser()
  const { data: userReviews } = useGet(`/api/users/${currentUser?._id}/reviews`, {
    skip: !currentUser,
  })

  return (
    <div>
      <div className='p-4'>
        <h1 className='text-xl font-black mb-2'>Noter une poutine</h1>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type='text'
          className='font-bold text-sm'
          placeholder='Quelle poutine voulez-vous noter?'
          isSearch
        />
      </div>

      <SelectRestaurant
        restaurants={searchResults}
        userRatedRestaurants={userReviews}
        onSelect={(restaurant, alreadyRated) => {}}
      />
    </div>
  )
}

export default Noter
