import Link from 'next/link'
import React from 'react'
import { Hash, Heart, Home, Lock, Search, User, Users, Watch } from 'react-feather'
import Image from 'next/image'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useCurrentUser } from 'lib/useCurrentUser'

const Item = ({ label, href, icon, disabled }) => {
  const { pathname } = useRouter()
  const isActive = pathname?.split('/')[1] === href
  const Icon = icon

  return (
    <Link href={'/' + href} passHref>
      <div
        className={classNames(
          'flex items-center p-3 xl:p-5 pl-4 xl:pl-12 text-base xl:text-lg cursor-pointer select-none',
          {
            'bg-orange-100 font-bold text-orange-600': isActive,
            'hover:bg-orange-100': !disabled,
            'text-gray-300 hover:bg-white cursor-default pointer-events-none': disabled,
          }
        )}
      >
        <span className='mr-3 xl:mr-5'>
          <Icon size={22} />
        </span>
        {label}
      </div>
    </Link>
  )
}

const Sidebar = ({ showMobileSidebar, toggleMobileSidebar }) => {
  const { currentUser } = useCurrentUser()

  return (
    <>
      {showMobileSidebar && (
        <div className='bg-black fixed h-screen w-screen z-10 bg-opacity-40 block lg:hidden'></div>
      )}
      <nav
        className={classNames(
          'lg:block fixed lg:static lg:w-[200px] xl:w-[300px] border-r lg:pt-2 h-screen',
          {
            hidden: !showMobileSidebar,
            'block bg-white h-screen shadow-xl z-10': showMobileSidebar,
          }
        )}
      >
        <Link href='/'>
          <a>
            <div className='flex items-center xl:pl-8 xl:mb-2 transform scale-75 xl:scale-100'>
              <Image alt='poutine-logo' src='/poutine.png' width={1.506 * 80} height={80} />
              <div className='text-lg font-black mt-[-8px] ml-1'>
                <div className='text-amber-600'>POUTINE</div>
                <div className='mt-[-10px] text-orange-600'>MANIA</div>
              </div>
            </div>
          </a>
        </Link>
        <Item label='Découvrir' icon={Hash} href='feed' disabled />
        <Item label='Restaurants' icon={Search} href='restaurants' />
        <Item label='À essayer (3)' icon={Watch} href='watchlist' disabled />
        <Item label='Mon top poutines' icon={Heart} href='mon-top' disabled />
        {currentUser && <Item label='Profil' icon={User} href='profil' disabled />}
        {currentUser?.isAdmin && <Item label='Admin' icon={Lock} href='admin' />}
      </nav>
    </>
  )
}

export default Sidebar
