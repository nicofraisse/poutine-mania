import React from 'react'
import Input from 'components/Input'
import { useRouter } from 'next/router'
import { useRestaurantSearch } from './context/RestaurantSearchProvider'

const RestaurantSearchBar = React.forwardRef(({ onSubmit }, ref) => {
  const { push } = useRouter()
  const { searchValue, setSearchValue } = useRestaurantSearch()
  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedSearchValue = searchValue?.trim()
    push(trimmedSearchValue ? `/restaurants?search=${trimmedSearchValue}` : `/restaurants`)
    onSubmit && onSubmit()
  }

  return (
    <form className='w-full' onSubmit={handleSearch} ref={ref}>
      <Input
        type='text'
        className='font-bold text-sm grow sm:ml-6 mr-1 lg:mx-0'
        placeholder='Rechercher une poutine'
        isSearch
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </form>
  )
})

RestaurantSearchBar.displayName = 'RestaurantSearchBar'

export default RestaurantSearchBar
