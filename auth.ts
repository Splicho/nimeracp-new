import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyAccount } from "./actions/auth"

export const { handlers: { GET, POST }, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;
        
        if (!username || !password) return null;
        
        const user = await verifyAccount(username, password);
        return user ? {
          id: user.id.toString(),
          name: user.username,
          role: user.role
        } : null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user && typeof user === 'object' && 'role' in user) {
        token.role = user.role as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof session.user === 'object' && 'role' in session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/'
  }
}) 