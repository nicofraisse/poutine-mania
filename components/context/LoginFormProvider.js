import { createContext, useContext, useState } from 'react'
import { X } from 'react-feather'
import Modal from 'react-responsive-modal'
import Login from '../forms/Login'

const LoginFormContext = createContext({})

export const LoginFormProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false)
  const openLogin = (message) => {
    setLoginOpen(true)
  }

  // if (not logged in) {
  //   return (
  //     <Alert
  //       className="m-4"
  //       title="Error loading user"
  //       type="error"
  //       showIcon
  //       description={error.message}
  //     />
  //   )
  // }

  return (
    <LoginFormContext.Provider value={{ openLogin }}>
      <>
        {children}
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
      </>
    </LoginFormContext.Provider>
  )
}

export const useLoginForm = () => {
  return useContext(LoginFormContext)
}

export default LoginFormContext
