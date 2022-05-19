import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import toast from 'react-hot-toast'

import { verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

export default NextAuth({
  session: {
    jwt: true,
  },
  callbacks: {
    session: async (session, user) => {
      const client = await connectToDatabase()
      const db = await client.db()
      const foundUser = await db.collection('users').findOne({ email: user.email })
      session.user = { _id: foundUser._id, email: foundUser.email }
      return Promise.resolve(session)
    },
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase()
        const usersCollection = client.db().collection('users')
        const user = await usersCollection.findOne({
          email: credentials.email,
        })
        if (!user) {
          client.close()
          throw new Error('No user found!')
        }

        const isValid = await verifyPassword(credentials.password, user.password)
        if (!isValid) {
          client.close()
          throw new Error('Could not log you in!')
        }

        client.close()
        return { email: user.email, id: user._id }
      },
    }),
  ],
})
