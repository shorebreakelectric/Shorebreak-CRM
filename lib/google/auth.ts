/**
 * Google OAuth configuration for Shorebreak CRM.
 *
 * Required environment variables:
 *   GOOGLE_CLIENT_ID     — from Google Cloud Console OAuth 2.0 credentials
 *   GOOGLE_CLIENT_SECRET — from Google Cloud Console OAuth 2.0 credentials
 *   NEXTAUTH_SECRET      — random secret (e.g. `openssl rand -base64 32`)
 *   NEXTAUTH_URL         — base URL of this app (e.g. http://localhost:3000)
 *
 * Scopes requested:
 *   - Gmail (read + compose)
 *   - Google Calendar (read + write)
 *   - Google Drive (read + write)
 */

import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/drive",
].join(" ");

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: GOOGLE_SCOPES,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
