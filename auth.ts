import NextAuth, { Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyMasterAccount } from "./actions/masteraccount"
import { JWT } from "next-auth/jwt"

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string
          password: string
        }

        const user = await verifyMasterAccount(username, password)
        
        if (user) {
          return {
            id: String(user.id),
            username: user.username,
            email: user.email
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          email: token.email
        },
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.username = (user as any).username
        token.email = user.email as string
      }
      return token
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
}) 