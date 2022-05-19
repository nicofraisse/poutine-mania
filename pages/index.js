import PublicProfile from '../components/profile/PublicProfile'
import { useCurrentUser } from 'lib/useCurrentUser'

function HomePage() {
  const { currentUser, loading } = useCurrentUser()
  console.log(currentUser)
  if (loading) return 'loading'
  if (!currentUser) return 'please login'
  return <PublicProfile />
}

export default HomePage
