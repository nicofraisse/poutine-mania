import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import toast from 'react-hot-toast'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

import { verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

export default NextAuth({
  session: {
    jwt: true,
  },
  jwt: {
    encryption: true,
  },
  secret: 'secret token',
  callbacks: {
    async jwt(token, account) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken
      }
      return token
    },
    redirect: async (url, _baseUrl) => {
      if (url === '/user') {
        return Promise.resolve('/')
      }
      return Promise.resolve('/')
    },
    session: async (session, user) => {
      const client = await connectToDatabase()
      const db = await client.db()
      const foundUser = await db.collection('users').findOne({ email: user.email })
      session.user = {
        _id: foundUser._id,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
        name: foundUser.name,
        image: foundUser.image,
        emailVerified: foundUser.emailVerified,
      }
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  database: process.env.MONGO_URI,
})
