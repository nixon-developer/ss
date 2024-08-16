import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import connectToDB from '@/utils/db';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials.username || !credentials.password) {
          throw new Error("Invalid username or password");
        }

        await connectToDB();

        const user = await User.findOne({ username: credentials.username });

        if (!user || !user?.password) {
          throw new Error("Invalid username or password");
        }

        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid username or password");
        }

        return { id: user._id, name: user.name, username: user.username, role: user.userRole };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      session.user = token;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
