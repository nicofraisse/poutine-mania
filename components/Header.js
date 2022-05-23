import Link from 'next/link'
import { signOut } from 'next-auth/client'
import { useCurrentUser } from 'lib/useCurrentUser'
import Button from './Button'
import { Edit3, Menu, User } from 'react-feather'
import { useState, createRef } from 'react'
import Dropdown from './Dropdown'
import Input from 'components/Input'
import { useRateRestaurant } from './context/RateRestaurantProvider'
import { useLoginForm } from './context/LoginFormProvider'

const Header = ({ toggleMobileSidebar }) => {
  const { currentUser } = useCurrentUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleRef = createRef()
  const { rateRestaurant } = useRateRestaurant()
  const { openLogin, openSignup } = useLoginForm()

  return (
    <header className='flex justify-between items-center h-[64px] w-full bg-indigo-white pl-4 border-b sticky top-0 z-20 bg-white'>
      <Menu className='md:hidden w-20 mr-2' onClick={() => toggleMobileSidebar()} />
      <Input
        type='text'
        className='block font-bold text-sm'
        placeholder='Rechercher une poutine'
        isSearch
      />

      <nav>
        <ul className='flex items-center'>
          {currentUser && (
            <>
              <Button
                variant='light'
                size='sm'
                className='flex lg:ml-6 mr-2 w-32 lg:w-48'
                onClick={() => rateRestaurant()}
              >
                <Edit3 className='mr-2' /> Noter une poutine
              </Button>

              <div className='relative mx-3 lg:mx-5 z-20'>
                <div
                  className='h-[48px] w-[48px] bg-gray-400 rounded-full cursor-pointer hover:opacity-80 flex items-center justify-center'
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  ref={toggleRef}
                >
                  <User className='text-white' size={30} />
                </div>
                <Dropdown isOpen={dropdownOpen} setIsOpen={setDropdownOpen} toggleRef={toggleRef}>
                  <>
                    <div className='hover:bg-gray-100 rounded-t-lg px-3 py-2 text-gray-700 cursor-pointer'>
                      <Link href={`/users/${currentUser._id}`}>Mon profil</Link>
                    </div>
                    <div className='hover:bg-gray-100 px-3 py-2 text-gray-700 cursor-pointer'>
                      <Link href='/profile'>Paramètres</Link>
                    </div>

                    <div
                      className='hover:bg-gray-100 px-3 py-2 rounded-b-lg text-gray-700 cursor-pointer'
                      onClick={signOut}
                    >
                      Déconnextion
                    </div>
                  </>
                </Dropdown>
              </div>
            </>
          )}
          {!currentUser && (
            <>
              <div className='mx-1 lg:mx-4'>
                <Button size='sm' variant='noBorder' onClick={openLogin}>
                  Connexion
                </Button>
              </div>
              <div className='mr-1 lg:mr-4'>
                <Button variant='secondary' size='sm' onClick={openSignup}>
                  Inscription
                </Button>
              </div>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
