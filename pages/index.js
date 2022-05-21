import PublicProfile from '../components/profile/PublicProfile'
import { useCurrentUser } from 'lib/useCurrentUser'
import SiteMap from '../components/SiteMap'
import Spinner from '../components/Spinner'

function HomePage() {
  const { currentUser, loading } = useCurrentUser()
  const isAdmin = true
  if (loading) return <Spinner />
  if (!currentUser) return 'please login'

  return (
    <>
      {isAdmin && <SiteMap />}
      <PublicProfile />
    </>
  )
  return
}

export default HomePage
