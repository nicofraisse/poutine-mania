import { useEffect } from 'react'
import { useRouter } from 'next/router'

function HomePage() {
  const { push } = useRouter()
  useEffect(() => {
    push('/top-poutines')
  }, [push])

  return <div></div>
}

export default HomePage
