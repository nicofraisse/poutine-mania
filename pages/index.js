import Spinner from '../components/Spinner'
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'

function HomePage() {
  const { replace, isFallback } = useRouter()

  useLayoutEffect(() => {
    replace('/restaurants')
  }, [replace, isFallback])

  return <Spinner />
}

export default HomePage
