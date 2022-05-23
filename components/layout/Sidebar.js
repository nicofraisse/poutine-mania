import Link from 'next/link'
import React from 'react'
import { Hash, Heart, Home, Lock, Search, User, Users, Watch } from 'react-feather'
import Image from 'next/image'
import { useRouter } from 'next/router'
import classNames from 'classnames'

const Item = ({ label, href, icon }) => {
  const { pathname } = useRouter()
  const isActive = pathname?.split('/')[1] === href
  const Icon = icon

  return (
    <Link href={'/' + href} passHref>
      <div
        className={classNames(
          'flex items-center p-5 pl-12 text-lg hover:bg-gray-100 cursor-pointer',
          {
            'bg-orange-500 font-bold text-white': isActive,
          }
        )}
      >
        <span className='mr-5'>
          <Icon size={22} />
        </span>
        {label}
      </div>
    </Link>
  )
}

const Sidebar = () => {
  return (
    <nav className='w-[300px] h-screen border-r bg-white pt-2 overflow-scroll fixed'>
      <Link href='/'>
        <a>
          <div className='flex items-center pl-8 mb-2'>
            <Image alt='poutine-logo' src='/poutine.png' width={1.506 * 80} height={80} />
            <div className='text-lg font-black mt-[-8px] ml-1'>
              <div className='text-amber-600'>POUTINE</div>
              <div className='mt-[-10px] text-orange-600'>MANIA</div>
            </div>
          </div>
        </a>
      </Link>
      <Item label='Découvrir' icon={Hash} href='feed' />
      <Item label='À essayer (3)' icon={Watch} href='watchlist' />
      <Item label='Restaurants' icon={Search} href='restaurants' />
      <Item label='Mon top poutines' icon={Heart} href='mon-top' />
      <Item label='Communauté' icon={Users} href='users' />
      <Item label='Profil' icon={User} href='profil' />
      <Item label='Admin' icon={Lock} href='admin' />
    </nav>
  )
}

export default Sidebar
