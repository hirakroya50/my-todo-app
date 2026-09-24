import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";
import { githubOAuthEnv, googleOAuthEnv } from "@/lib/oauth-env";
import { credentialsLoginSchema } from "@/lib/schemas/auth";

const googleOAuth = googleOAuthEnv();
const githubOAuth = githubOAuthEnv();

const providers = [
  ...(googleOAuth
    ? [
        Google({
          clientId: googleOAuth.clientId,
          clientSecret: googleOAuth.clientSecret,
          allowDangerousEmailAccountLinking: false,
        }),
      ]
    : []),
  ...(githubOAuth
    ? [
        GitHub({
          clientId: githubOAuth.clientId,
          clientSecret: githubOAuth.clientSecret,
          allowDangerousEmailAccountLinking: false,
        }),
      ]
    : []),
  Credentials({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = credentialsLoginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const user = await db.user.findUnique({
        where: { email: parsed.data.email },
      });
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(
        parsed.data.password,
        user.passwordHash,
      );
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers,
});
