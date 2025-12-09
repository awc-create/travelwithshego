// src/lib/auth.ts
import type { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Adapter } from 'next-auth/adapters';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// ─────────────────────────────────────────
//   Module augmentation for strong typing
// ─────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    // Keep `user` optional to match base type
    user?: DefaultSession['user'] & {
      id: string;
      role?: string | null;
    };
  }

  interface User extends DefaultUser {
    role?: string | null;
  }
}

declare module 'next-auth/jwt' {
  // Just augment the existing JWT – no extends, no alias
  interface JWT {
    id?: string;
    role?: string | null;
  }
}

// ─────────────────────────────────────────
//   Auth options
// ─────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  session: {
    strategy: 'jwt',
  },

  // Use one stable secret (AUTH_SECRET preferred, fallback NEXTAUTH_SECRET)
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Email + Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      // First login: copy from `user` into token
      if (user) {
        token.id = user.id;
        token.email = user.email ?? null;
        token.name = user.name ?? null;
        token.role = user.role ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      // Ensure session.user exists
      if (!session.user) {
        session.user = {
          id: '',
          email: '',
        };
      }

      if (token.id) {
        session.user.id = token.id;
      }

      if (token.email) {
        session.user.email = token.email;
      }

      if (typeof token.name !== 'undefined') {
        session.user.name = token.name ?? undefined;
      }

      if (typeof token.role !== 'undefined') {
        session.user.role = token.role ?? undefined;
      }

      return session;
    },
  },
};
