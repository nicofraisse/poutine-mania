import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { verifyPassword } from "lib/auth";
import { connectToDatabase } from "lib/db";
import { generateSlug } from "../../../lib/generateSlug";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/dbPromise";
import { ObjectId } from "mongodb";

const baseAdapter = MongoDBAdapter(clientPromise);

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET, encryption: true },
  adapter: {
    ...baseAdapter,
    async createUser(userData) {
      const user = await baseAdapter.createUser(userData);

      const client = await connectToDatabase();
      const db = client.db();
      const _id = typeof user.id === "string" ? new ObjectId(user.id) : user.id;

      await db
        .collection("users")
        .updateOne(
          { _id },
          { $set: { createdAt: new Date(), updatedAt: new Date() } }
        );

      return { ...user, createdAt: new Date(), updatedAt: new Date() };
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user._id ?? user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = user.isAdmin;
      }
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }

      return token;
    },

    async signIn({ user, account }) {
      if (["google", "facebook"].includes(account?.provider)) {
        const client = await connectToDatabase();
        const db = client.db();
        const usersCollection = db.collection("users");

        user.emailVerified = true;

        await usersCollection.updateOne(
          { email: user.email },
          { $set: { emailVerified: true } }
        );
      }
      if (!user?.emailVerified) {
        const error = JSON.stringify({
          code: "EMAIL_NOT_VALIDATED",
          messageKey: "backend.nextauth.emailNotValidated",
        });
        throw new Error(error);
      }
      return true;
    },

    session: async ({ session, token }) => {
      const client = await connectToDatabase();
      const db = client.db();
      const foundUser = await db
        .collection("users")
        .findOne({ email: token.email });

      if (foundUser) {
        if (!foundUser.slug) {
          const slug = await generateSlug(foundUser.name, db, "users");
          await db.collection("users").updateOne(
            { _id: foundUser._id },
            {
              $set: {
                slug,
              },
            }
          );
        }

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

        if (!foundUser.eatenlist) {
          await db.collection("users").updateOne(
            { _id: foundUser._id },
            {
              $set: {
                eatenlist: [],
              },
            }
          );
        }

        if (!foundUser.watchlist) {
          await db.collection("users").updateOne(
            { _id: foundUser._id },
            {
              $set: {
                watchlist: [],
              },
            }
          );
        }

        session.user = {
          _id: foundUser._id,
          email: foundUser.email,
          isAdmin: foundUser.isAdmin,
          name: foundUser.name,
          bio: foundUser.bio,
          image: foundUser.image,
          emailVerified: foundUser.emailVerified,
          eatenlist: foundUser.eatenlist,
          watchlist: foundUser.watchlist,
          slug: foundUser.slug,
          connectedAccounts: foundConnectedAccounts,
          nbReviews: reviews.length,
        };

        return session;
      } else {
        throw new Error("No session");
      }
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          const error = JSON.stringify({
            code: "INVALID_CREDENTIALS",
            messageKey: "backend.nextauth.invalidCredentials",
          });
          throw new Error(error);
        }

        const foundExistingAccount = await client
          .db()
          .collection("accounts")
          .findOne({ userId: user._id });

        if (foundExistingAccount) {
          if (foundExistingAccount.provider === "google") {
            const error = JSON.stringify({
              code: "USE_GOOGLE_PROVIDER",
              messageKey: "backend.nextauth.useGoogleProvider",
            });
            throw new Error(error);
          } else {
            const error = JSON.stringify({
              code: "USE_ANOTHER_PROVIDER",
              messageKey: "backend.nextauth.useAnotherProvider",
            });
            throw new Error(error);
          }
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          const error = JSON.stringify({
            code: "INVALID_CREDENTIALS",
            messageKey: "backend.nextauth.invalidCredentials",
          });
          throw new Error(error);
        }

        return {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          name: user.name,
          bio: user.bio,
          image: user.image,
          emailVerified: user.emailVerified,
        };
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
          // redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`, // should try this again
          redirect_uri: "https://www.poutinemania.ca/api/auth/callback/google",
        },
      },
    }),
  ],
};

export default (req, res) => NextAuth(req, res, authOptions);
