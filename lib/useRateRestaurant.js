import React, { useState } from 'react'
import { X } from 'react-feather'
import Modal from 'react-responsive-modal'
import RateRestaurant from '../components/forms/RateRestaurant'

const useRateRestaurant = () => {
  const [rateOpen, setRateOpen] = useState(false)

  return (
    <>
      <Modal
        classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}
        open={rateOpen}
        onClose={() => setRateOpen(false)}
        closeIcon={<X />}
        center
      >
        <RateRestaurant onClose={() => setRateOpen(false)} />
      </Modal>
    </>
  )
}

export { useRateRestaurant }
