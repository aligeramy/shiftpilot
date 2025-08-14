import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required")
}

export const { auth } = NextAuth({
  // No adapter here — this file must be Edge-compatible for middleware usage
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Not used in middleware; return null to disable sign-in here
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token }) {
      // Token was enriched during Node runtime sign-in
      return token
    },
    async session({ session, token }) {
      if (token) {
        // Preserve data set during Node runtime
        session.user.id = token.id as string
        session.user.image = (token.image as string | null) ?? null
      }
      return session
    },
  },
})


