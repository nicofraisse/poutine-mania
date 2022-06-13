import Link from 'next/link'
import React, { useEffect } from 'react'
import { Hash, Heart, Home, Lock, Search, User, Users, Watch } from 'react-feather'
import Image from 'next/image'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useCurrentUser } from 'lib/useCurrentUser'

const Item = ({ label, href, icon, disabled, onClick }) => {
  const { pathname } = useRouter()
  const isActive = pathname?.split('/')[1] === href.split('/')[0]
  const Icon = icon

  return (
    <Link href={'/' + href} passHref>
      <div
        onClick={onClick}
        className={classNames(
          'flex items-center p-3 xl:p-4 pl-4 xl:pl-9 text-base xl:text-lg cursor-pointer select-none',
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
        <div
          className='bg-black fixed h-screen w-screen z-10 bg-opacity-40 block lg:hidden'
          onClick={toggleMobileSidebar}
        ></div>
      )}
      <div
        className={classNames('fixed lg:static lg:block lg:min-w-[200px] xl:min-w-[256px]', {
          hidden: !showMobileSidebar,
          'block bg-white h-screen  z-10': showMobileSidebar,
        })}
      >
        <nav
          className={classNames(
            'border-r lg:pt-2 h-screen lg:fixed lg:min-w-[200px] xl:min-w-[256px]'
          )}
        >
          <Link href='/'>
            <a>
              <div className='flex items-center -ml-2 xl:-ml-0 xl:pl-4 xl:mb-2 transform scale-75 xl:scale-100'>
                <Image alt='poutine-logo' src='/poutine.png' width={1.506 * 80} height={80} />
                <div className='text-lg font-black mt-[-8px] ml-1'>
                  <div className='text-amber-600'>POUTINE</div>
                  <div className='mt-[-10px] text-orange-600'>MANIA</div>
                </div>
              </div>
            </a>
          </Link>
          <Item onClick={toggleMobileSidebar} label='Découvrir' icon={Hash} href='/' />
          <Item
            onClick={toggleMobileSidebar}
            label='Restaurants'
            icon={Search}
            href='restaurants'
          />
          {/* <Item
            onClick={toggleMobileSidebar}
            label='À essayer (3)'
            icon={Watch}
            href='watchlist'
            disabled
          />
          <Item
            onClick={toggleMobileSidebar}
            label='Mon top poutines'
            icon={Heart}
            href='mon-top'
            disabled
          /> */}
          {currentUser && (
            <Item
              onClick={toggleMobileSidebar}
              label='Profil'
              icon={User}
              href={`users/${currentUser._id}`}
            />
          )}
          {currentUser?.isAdmin && (
            <Item onClick={toggleMobileSidebar} label='Admin' icon={Lock} href='admin' />
          )}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
