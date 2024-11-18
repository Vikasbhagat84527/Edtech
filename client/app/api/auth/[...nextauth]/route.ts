import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "@/src/utils/axiosInstance";
//import FacebookProvider from "next-auth/providers/facebook";
//import AppleProvider from "next-auth/providers/apple";

export const authOptions: AuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Call the backend API to validate credentials
          const response = await axiosInstance.post(
            "http://localhost:5000/auth/login",
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          const user = response.data;

          // If the backend validates the user, return user details
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.email,
            };
          }
          return null; // Return null if login fails
        } catch (error: any) {
          console.error(
            "Authorize Error:",
            error.response?.data || error.message
          );
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
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub as string,
      };
      return session;
    },
    async jwt({ token, user }) {
      // Add user ID to the JWT token
      if (user) {
        token.sub = user.id; // Attach user ID to the token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // A secret key for encrypting tokens
};

// Create NextAuth handler using authOptions
const handler = NextAuth(authOptions);

// Export handlers for GET and POST requests
export { handler as POST, handler as GET };
