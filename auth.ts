import NextAuth, { Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyAccount } from "./actions/auth"
import { DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"

// Add the role mapping
export const SECURITY_LEVELS = {
  0: 'Player',
  1: 'Moderator',
  2: 'Game Master',
  3: 'Administrator'
} as const

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email: string | null | undefined
      role: string
      securityLevel: number // Add this to store the raw security level
    } & DefaultSession["user"]
  }

  interface User {
    id?: string
    username: string
    role: string
    securityLevel: number // Add this to store the raw security level
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    role: string
    securityLevel: number // Add this to store the raw security level
  }
}

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

        const user = await verifyAccount(username, password)
        
        if (user) {
          console.log('Authorize returning:', user);
          return {
            id: String(user.id),
            username: user.username,
            role: SECURITY_LEVELS[user.securityLevel as keyof typeof SECURITY_LEVELS],
            securityLevel: user.securityLevel
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      const securityLevel = token.securityLevel ?? parseInt(token.role) ?? 0;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          email: token.email,
          role: SECURITY_LEVELS[securityLevel as keyof typeof SECURITY_LEVELS],
          securityLevel: securityLevel
        },
      }
    },
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback user data:', { 
          user,
          currentToken: token 
        });
        token.id = user.id!
        token.username = user.username
        token.role = user.role
        token.securityLevel = user.securityLevel
      }
      return token
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
}) 