// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string | null;
  }

  interface Session {
    user?: {
      id?: string;
      email?: string | null;
      name?: string | null;
      role?: string | null;
    };
  }
}
