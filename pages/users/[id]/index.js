import { useRouter } from 'next/router'
import React from 'react'
import PublicProfile from '../../../components/profile/PublicProfile'
import { useGet } from '../../../lib/useAxios'

const User = () => {
  const { query } = useRouter()
  const { data } = useGet(`/api/users/${query.id}`, { skip: !query.id })
  return (
    <div>
      <PublicProfile user={data} />{' '}
    </div>
  )
}

export default User
