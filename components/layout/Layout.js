import Header from '../Header'
import { Modal } from 'react-responsive-modal'
import { useState } from 'react'
import 'react-responsive-modal/styles.css'
import { X } from 'react-feather'
import SignUp from '../forms/SignUp'

const Layout = (props) => {
  const [signupOpen, setSignupOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div>
      <Header
        handleOpenSignup={() => setSignupOpen(true)}
        handleOpenLogin={() => setLoginOpen(true)}
      />
      <main>{props.children}</main>
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
        <h2 className='font-black text-3xl text-center pb-3 pt-5'>Créer mon compte</h2>
        <SignUp />
      </Modal>
    </div>
  )
}

export default Layout
