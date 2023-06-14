import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import GoogleProvider from "next-auth/providers/google";
import { Adapter, AdapterUser } from "next-auth/adapters";

interface SessionType extends DefaultSession {
  // A JWT which can be used as Authorization header with supabase-js for RLS.
  supabaseAccessToken?: string;
  user?: {
    // user's postal address
    address?: string;
  } & DefaultSession["user"];
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({
      session,
      user,
    }: {
      session: SessionType;
      user: AdapterUser;
    }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      return session;
    },
  },
  secret: "thisisnotspiderman",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
