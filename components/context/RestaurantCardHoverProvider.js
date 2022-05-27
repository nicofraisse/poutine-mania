import { createContext, useContext, useState } from 'react'

const RestaurantCardHoverContext = createContext({})

export const RestaurantCardHoverProvider = ({ children }) => {
  const [hoveredId, setHoveredId] = useState('')

  return (
    <RestaurantCardHoverContext.Provider value={{ hoveredId, setHoveredId }}>
      {children}
    </RestaurantCardHoverContext.Provider>
  )
}

export const useRestaurantCardHover = () => {
  return useContext(RestaurantCardHoverContext)
}

export default RestaurantCardHoverContext
