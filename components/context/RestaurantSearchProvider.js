import { createContext, useContext, useState } from 'react'

const RestaurantSearchContext = createContext({})

export const RestaurantSearchProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <RestaurantSearchContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </RestaurantSearchContext.Provider>
  )
}

export const useRestaurantSearch = () => {
  return useContext(RestaurantSearchContext)
}

export default RestaurantSearchContext
