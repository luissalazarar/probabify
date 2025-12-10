import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scopes = [
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
].join(" ");

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${encodeURIComponent(
        scopes
      )}`,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Guarda el access token de Spotify en el JWT
    async jwt({ token, account }) {
      if (account) {
        // primer login
        (token as any).accessToken = account.access_token;
      }
      return token;
    },
    // Expone el access token en la session que ve el frontend
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
