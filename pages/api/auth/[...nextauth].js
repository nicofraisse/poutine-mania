import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { capitalize } from "lodash";
import { verifyPassword } from "lib/auth";
import { connectToDatabase } from "lib/db";

export default NextAuth({
  // pages: {
  //   error: "/",
  // },
  session: {
    jwt: true,
  },
  jwt: {
    encryption: true,
  },
  secret: "lkxklfjlkxd",
  callbacks: {
    async jwt(token, account) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    // redirect: async (url, _baseUrl) => {
    //   return Promise.resolve('/')
    // },
    // },
    session: async (session, user) => {
      const client = await connectToDatabase();
      const db = await client.db();
      const foundUser = await db
        .collection("users")
        .findOne({ email: user.email });

      if (foundUser) {
        const foundConnectedAccounts = await db
          .collection("accounts")
          .find({ userId: foundUser._id })
          .toArray();

        const reviews = await db
          .collection("reviews")
          .aggregate([
            {
              $match: {
                userId: foundUser._id,
              },
            },
          ])
          .toArray();
        session.user = {
          _id: foundUser._id,
          email: foundUser.email,
          isAdmin: foundUser.isAdmin,
          name: foundUser.name,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          image: foundUser.image,
          emailVerified: foundUser.emailVerified,
          eatenlist: foundUser.eatenlist,
          watchlist: foundUser.watchlist,
          connectedAccounts: foundConnectedAccounts,
          nbReviews: reviews.length,
        };
        return Promise.resolve(session);
      } else {
        throw new Error("No session");
      }
    },
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("Le courriel ou mot de passe est invalide");
        }

        const foundExistingAccount = await client
          .db()
          .collection("accounts")
          .findOne({ userId: user._id });

        if (foundExistingAccount) {
          client.close();
          throw new Error(
            `Cliquez sur "Continuer avec ${capitalize(
              foundExistingAccount.providerId
            )}" pour vous connecter à ce compte.`
          );
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          client.close();
          throw new Error("Le courriel ou mot de passe est invalide");
        }

        client.close();
        return { email: user.email, id: user._id };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  database: process.env.MONGO_URI,
});
