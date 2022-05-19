import { getSession } from 'next-auth/client'

import UserProfile from '../components/profile/UserProfile'

function ProfilePage() {
  return <UserProfile />
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default ProfilePage
