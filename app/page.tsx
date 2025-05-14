"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>; // 세션 로딩 중 표시
    }

    return (
        <div>
            {session ? (
                <div>
                    <p>Welcome, {session.user?.email}</p>
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
