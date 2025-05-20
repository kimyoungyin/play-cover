import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt" as const, // JWT 기반 세션 관리
        maxAge: 30 * 24 * 60 * 60, // 세션 만료 시간: 30일
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // JWT 만료 시간: 30일
    },
    secret: process.env.NEXTAUTH_SECRET,
};
