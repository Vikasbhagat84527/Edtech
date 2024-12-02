import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "@/src/utils/axiosInstance";

declare module "next-auth" {
  interface Profile {
    picture?: string;
  }
}
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axiosInstance.post("/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = response.data;
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.email,
            };
          }
          return null;
        } catch {
          throw new Error("Login failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return url;
      return baseUrl + "/dashboard";
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub as string,
        image: token.picture || "/default-avatar.png",
      };
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.sub = user.id;
      }

      if (account?.provider === "google" && profile?.picture === "string") {
        token.picture = profile.picture;
      }

      if (
        account?.provider === "facebook" &&
        typeof profile?.picture === "string"
      ) {
        token.picture = profile.picture;
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
