import Header from '../Header'
import { Modal } from 'react-responsive-modal'
import { useState } from 'react'
import 'react-responsive-modal/styles.css'
import { X } from 'react-feather'
import SignUp from '../forms/SignUp'
import Login from '../forms/Login'
import RateRestaurant from '../forms/RateRestaurant'
import Sidebar from './Sidebar'

const Layout = (props) => {
  const [signupOpen, setSignupOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [rateOpen, setRateOpen] = useState(false)

  return (
    <div>
      <div className='flex'>
        <div className='w-[300px]'>
          <Sidebar />
        </div>
        <div style={{ width: 'calc(100vw - 300px)' }}>
          <Header
            handleOpenSignup={() => setSignupOpen(true)}
            handleOpenLogin={() => setLoginOpen(true)}
            handleOpenRate={() => setRateOpen(true)}
          />

          <main className='min-h-screen-minus-nav'>{props.children}</main>
        </div>
      </div>

      <Modal
        classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        closeIcon={<X />}
        center
      >
        <h2 className='font-black text-3xl text-center pb-3 pt-5'>Créer mon compte</h2>
        <SignUp onSubmit={() => setSignupOpen(false)} />
      </Modal>
      <Modal
        classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        closeIcon={<X />}
        center
      >
        <h2 className='font-black text-3xl text-center pb-3 pt-5'>Connexion</h2>
        <Login onSubmit={() => setLoginOpen(false)} />
      </Modal>
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
    </div>
  )
}

export default Layout
