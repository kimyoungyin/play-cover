import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.sub!; // Google OAuth에서 제공하는 고유 ID를 세션에 포함
            }
            return session;
        },
    },
    session: {
        strategy: "jwt" as const, // JWT 기반 세션 관리
        maxAge: 30 * 24 * 60 * 60, // 세션 만료 시간: 30일
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // JWT 만료 시간: 30일
    },
    secret: process.env.NEXTAUTH_SECRET,
};
