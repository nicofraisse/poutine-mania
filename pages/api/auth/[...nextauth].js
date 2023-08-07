import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { capitalize } from "lodash";
import { verifyPassword } from "lib/auth";
import { connectToDatabase } from "lib/db";
import { generateSlug } from "../../../lib/generateSlug";

export default NextAuth({
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

    async signIn(user, account) {
      if (account.provider === "google" || account.provider === "facebook") {
        const client = await connectToDatabase();
        const db = client.db();
        const usersCollection = db.collection("users");

        user.emailVerified = true;
        // Update the emailVerified status in the MongoDB database
        await usersCollection.updateOne(
          { email: user.email },
          { $set: { emailVerified: true } }
        );
        client.close();
      }
      if (!user.emailVerified) {
        const error = JSON.stringify({
          code: "EMAIL_NOT_VALIDATED",
          message:
            "Votre compte n'est pas encore activé, veuillez cliquer sur le lien que nous vous avons envoyé par courriel.",
        });
        throw new Error(error);
      }
      return true;
    },

    session: async (session, user) => {
      const client = await connectToDatabase();
      const db = await client.db();
      const foundUser = await db
        .collection("users")
        .findOne({ email: user.email });

      if (foundUser) {
        if (!foundUser.slug) {
          const slug = await generateSlug(user.name, db, "users");
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
            JSON.stringify({
              message: `Cliquez sur "Continuer avec ${capitalize(
                foundExistingAccount.providerId
              )}" pour vous connecter à ce compte.`,
            })
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
