import { query as q } from "faunadb";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { fauna } from "services/fauna";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user",
    }),
  ],
  callbacks: {
    async session(session) {
      session.user.email;

      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection(
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active")
            )
          )
        );

        return { ...session, activeSubscription: userActiveSubscription };
      } catch (error) {
        return { ...session, activeSubscription: null };
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;

      const userIndex = q.Match(q.Index("user_by_email"), q.Casefold(email));

      try {
        await fauna.query(
          q.If(
            q.Not(q.Exists(userIndex)), // condition
            q.Create(q.Collection("users"), { data: { email: email } }), // then
            q.Get(userIndex) // else
          )
        );

        return true;
      } catch (error) {
        return false;
      }
    },
  },
  // jwt: {
  //   signingKey: process.env.SIGNING_KEY,
  // },
});
