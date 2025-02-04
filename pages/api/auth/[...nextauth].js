import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import redis from '@/lib/redis'
import { createClient } from 'ioredis'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user?.email) {
        session.user.role = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',')
          .some(e => e.trim() === session.user.email)
          ? 'admin'
          : 'user'
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  }
}

export default NextAuth(authOptions)
