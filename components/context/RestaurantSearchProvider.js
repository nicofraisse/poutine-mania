import { createContext, useContext, useState } from 'react'
import { useDebounce } from 'use-debounce'

const RestaurantSearchContext = createContext({})

export const RestaurantSearchProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedValue] = useDebounce(searchValue, 500)

  return (
    <RestaurantSearchContext.Provider
      value={{ searchValue: debouncedValue, setSearchValue, nonDebouncedValue: searchValue }}
    >
      {children}
    </RestaurantSearchContext.Provider>
  )
}

export const useRestaurantSearch = () => {
  return useContext(RestaurantSearchContext)
}

export default RestaurantSearchContext
