import Link from 'next/link'
import { signOut } from 'next-auth/client'
import { useCurrentUser } from 'lib/useCurrentUser'
import Button from './Button'
import { Edit3, Menu, Search, User } from 'react-feather'
import { useState, createRef } from 'react'
import Dropdown from './Dropdown'
import Input from 'components/Input'
import { useRateRestaurant } from './context/RateRestaurantProvider'
import { useLoginForm } from './context/LoginFormProvider'
import Image from 'next/image'
import RestaurantSearchBar from './RestaurantSearchBar'

const Header = ({ toggleMobileSidebar }) => {
  const { currentUser } = useCurrentUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleRef = createRef()
  const { rateRestaurant } = useRateRestaurant()
  const { openLogin, openSignup } = useLoginForm()

  return (
    <header className='flex justify-between items-center h-[64px] w-full bg-indigo-white pl-4 border-b sticky top-0 z-10 bg-white'>
      <div className='flex items-center lg:hidden'>
        <Menu
          className='mr-3 min-w-12 cursor-pointer hover:opacity-70'
          onClick={() => toggleMobileSidebar()}
          size={28}
        />

        <div className='-mb-2 block select-none min-w-20' onClick={() => toggleMobileSidebar()}>
          <Link href='/'>
            <a>
              <Image alt='poutine-logo' src='/poutine.png' width={1.506 * 50} height={50} />
            </a>
          </Link>
        </div>
      </div>

      <RestaurantSearchBar />

      <nav>
        <div className='flex items-center'>
          <Button variant='light' size='sm' className='mx-3 sm:hidden'>
            <Search />
          </Button>
          {currentUser && (
            <>
              <Button
                variant='light'
                size='sm'
                className='flex grow lg:ml-6 xs:w-48'
                onClick={() => rateRestaurant()}
              >
                <Edit3 className='mr-2' /> <span>Noter</span>
                <span className='hidden xs:inline'> &nbsp;une poutine</span>
              </Button>

              <div className='relative mx-4 lg:mx-5 z-20'>
                <div
                  className='h-[44px] w-[44px] bg-gray-400 rounded-full cursor-pointer hover:opacity-80 flex items-center justify-center'
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
        </div>
      </nav>
    </header>
  )
}

export default Header
