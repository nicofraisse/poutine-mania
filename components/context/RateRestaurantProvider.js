import { createContext, useContext, useState } from 'react'
import { X } from 'react-feather'
import Modal from 'react-responsive-modal'
import RateRestaurant from '../forms/RateRestaurant'
import { useCurrentUser } from 'lib/useCurrentUser'
import { useLoginForm } from './LoginFormProvider'
import { useRouter } from 'next/router'

const RateRestaurantContext = createContext({})

export const RateRestaurantProvider = ({ children }) => {
  const [rateRestaurantOpen, setRateRestaurantOpen] = useState(false)
  const [preselectedRestaurant, setPreselectedRestaurant] = useState(null)
  const [existingReview, setExistingReview] = useState(null)

  const { currentUser } = useCurrentUser()
  const { openLogin } = useLoginForm()
  const { reload } = useRouter()

  const rateRestaurant = (restaurant, review) => {
    if (!currentUser) {
      openLogin()
    } else {
      setRateRestaurantOpen(true)
      setPreselectedRestaurant(restaurant)
      setExistingReview(review)
    }
  }

  return (
    <RateRestaurantContext.Provider value={{ rateRestaurant }}>
      <>
        {children}
        <Modal
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal',
          }}
          open={rateRestaurantOpen}
          onClose={() => setRateRestaurantOpen(false)}
          closeIcon={<X />}
          center
        >
          <RateRestaurant
            onSubmit={(id) => {
              setRateRestaurantOpen(false)
              reload(`/restaurants/${id}`)
            }}
            preselectedRestaurant={preselectedRestaurant}
            existingReview={existingReview}
          />
        </Modal>
      </>
    </RateRestaurantContext.Provider>
  )
}

export const useRateRestaurant = () => {
  return useContext(RateRestaurantContext)
}

export default RateRestaurantContext
