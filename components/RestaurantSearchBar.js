import React from 'react'
import Input from 'components/Input'
import { useRouter } from 'next/router'
import { useRestaurantSearch } from './context/RestaurantSearchProvider'

const RestaurantSearchBar = () => {
  const { push } = useRouter()
  const { searchValue, setSearchValue } = useRestaurantSearch()
  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedSearchValue = searchValue?.trim()

    push(trimmedSearchValue ? `/restaurants?search=${trimmedSearchValue}` : `/restaurants`)
  }

  return (
    <form className='w-full' onSubmit={handleSearch}>
      <Input
        type='text'
        className='font-bold text-sm hidden sm:block grow mx-6 lg:mx-0'
        placeholder='Rechercher une poutine'
        isSearch
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </form>
  )
}

export default RestaurantSearchBar
