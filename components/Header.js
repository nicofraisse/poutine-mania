import Link from 'next/link'
import { signOut } from 'next-auth/client'
import { useCurrentUser } from 'lib/useCurrentUser'
import Button from './Button'
import { Edit, Edit3, Search, User, Users } from 'react-feather'
import { useState, createRef } from 'react'
import Dropdown from './Dropdown'
import Image from 'next/image'
import Input from 'components/Input'
import { useRateRestaurant } from './context/RateRestaurantProvider'
import { useLoginForm } from './context/LoginFormProvider'

const Header = ({ handleOpenSignup, handleOpenLogin, handleOpenRate }) => {
  const { currentUser } = useCurrentUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleRef = createRef()
  const { rateRestaurant } = useRateRestaurant()
  const { openLogin } = useLoginForm()

  return (
    <header className='flex justify-between items-center h-[64px] w-full bg-indigo-white pl-4 border-b'>
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
                className='flex ml-6 mr-2 w-48'
                onClick={() => rateRestaurant()}
              >
                <Edit3 className='mr-2' /> Noter une poutine
              </Button>
              <div className='relative mx-5 z-20'>
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
              <div className='mx-4 text-neutral-700 hover:text-neutral-900'>
                <Button size='sm' variant='secondary' onClick={openLogin}>
                  Connexion
                </Button>
              </div>
              <div className='mr-4 text-neutral-700 hover:text-neutral-900'>
                <Button variant='primary' size='sm' onClick={handleOpenSignup}>
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
