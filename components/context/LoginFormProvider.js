import { createContext, useContext, useState } from 'react'
import { X } from 'react-feather'
import Modal from 'react-responsive-modal'
import Login from '../forms/Login'
import SignUp from '../forms/SignUp'

const LoginFormContext = createContext({})

export const LoginFormProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [loginMessage, setLoginMessage] = useState(null)

  const openLogin = (message) => {
    setLoginOpen(true)
    setLoginMessage(message || '')
  }

  const closeLogin = (message) => {
    setLoginOpen(false)
  }

  const openSignup = (message) => {
    setSignupOpen(true)
  }

  const closeSignup = (message) => {
    setSignupOpen(false)
  }

  return (
    <LoginFormContext.Provider value={{ openLogin, openSignup, closeLogin, closeSignup }}>
      <>
        {children}
        <Modal
          classNames={{
            overlay: 'customOverlay',
            modal: 'rateModal',
          }}
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          closeIcon={<X />}
          center
        >
          <div className='flex flex-col items-center'>
            {loginMessage || <h2 className='font-black text-3xl text-center pb-3'>Connexion</h2>}
            <Login onSubmit={() => setLoginOpen(false)} />
          </div>
        </Modal>
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
      </>
    </LoginFormContext.Provider>
  )
}

export const useLoginForm = () => {
  return useContext(LoginFormContext)
}

export default LoginFormContext
