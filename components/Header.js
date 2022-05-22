import Link from 'next/link'
import { signOut } from 'next-auth/client'
import { useCurrentUser } from 'lib/useCurrentUser'
import Button from './Button'
import { Edit, Search, Users } from 'react-feather'
import { useState, createRef } from 'react'
import Dropdown from './Dropdown'
import Image from 'next/image'
import Input from 'components/Input'

const Header = ({ handleOpenSignup, handleOpenLogin, handleOpenRate }) => {
  const { currentUser } = useCurrentUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleRef = createRef()

  return (
    <header className='flex justify-between items-center h-[64px] w-full bg-light-orange pl-4 border-b'>
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
              <Button size='sm' className='flex ml-6 mr-2' onClick={handleOpenRate}>
                <Edit className='mr-2' /> Noter
              </Button>
              <div className='relative mx-5'>
                <div
                  className='h-[48px] w-[48px] bg-gray-400 rounded-full cursor-pointer hover:opacity-80'
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  ref={toggleRef}
                ></div>
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
                <Button variant='primary' size='sm' onClick={handleOpenSignup}>
                  Inscription
                </Button>
              </div>
              <div className='mr-4 text-neutral-700 hover:text-neutral-900'>
                <Button href='/login' size='sm' variant='secondary' onClick={handleOpenLogin}>
                  Connexion
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
