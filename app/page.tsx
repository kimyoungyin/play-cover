"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Page() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>; // 세션 로딩 중 표시
    }

    return (
        <div>
            {session && status === "authenticated" ? (
                <div>
                    <p>Welcome, {session.user?.email}</p>
                    <Link href={"/music/search"}>커버곡 업로드하기</Link>
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            ) : (
                <div>
                    <p>You are not signed in</p>
                    <button onClick={() => signIn("google")}>
                        Sign in with Google
                    </button>
                </div>
            )}
        </div>
    );
}
