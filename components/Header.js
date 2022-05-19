import Link from 'next/link'
import { signOut } from 'next-auth/client'
import { useCurrentUser } from 'lib/useCurrentUser'
import Button from './Button'

const Header = ({ handleOpenSignup, handleOpenLogin }) => {
  const { currentUser, loading } = useCurrentUser()

  return (
    <header className='flex justify-between items-center p-4 bg-neutral-200'>
      <Link href='/'>
        <a className='font-black text-3xl border'>
          <div>Poutine Mania</div>
        </a>
      </Link>
      <nav>
        <ul className='flex text-lg'>
          {currentUser && (
            <li className='p-2 border mx-5 text-neutral-700 hover:text-neutral-900'>
              <Link href='/restaurants'>Gérer les restaurants</Link>
            </li>
          )}

          {!currentUser && !loading && (
            <li className='border mx-5 text-neutral-700 hover:text-neutral-900'>
              <Button variant='primary' onClick={handleOpenSignup}>
                Inscription
              </Button>
            </li>
          )}
          {!currentUser && !loading && (
            <li className='border mx-5 text-neutral-700 hover:text-neutral-900'>
              <Button variant='primary' href='/login' onClick={handleOpenLogin}>
                Connexion
              </Button>
            </li>
          )}
          {currentUser && (
            <li className='p-2 border mx-5 text-neutral-700 hover:text-neutral-900'>
              <Link href='/profile'>Mon profil</Link>
            </li>
          )}
          {currentUser && (
            <li className='p-2 border mx-5 text-neutral-700 hover:text-neutral-900'>
              <button onClick={signOut}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
