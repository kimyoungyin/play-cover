"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { KeyboardEvent } from "react";

const QUERY = "query";

export default function InputBox() {
    const [isSearching, setIsSearching] = useState(false);
    // 현재 검색 쿼리
    const searchParams = useSearchParams();
    // 검색할 새로운 쿼리
    const params = new URLSearchParams(searchParams);
    const pathname = usePathname();
    const { push } = useRouter();

    useEffect(() => {
        setIsSearching(false);
    }, [searchParams]);

    const handleSearchParamsChange = (term: string) => {
        const trimmedTerm = term.trim();
        if (trimmedTerm) {
            params.set(QUERY, trimmedTerm);
        } else {
            params.delete(QUERY);
        }
    };

    const handleSubmit = () => {
        const currentQuery = searchParams.get(QUERY);
        const newQuery = params.get(QUERY);
        // 검색어가 있고, 현재 검색어와 다를 때
        if (newQuery && newQuery !== currentQuery) {
            setIsSearching(true);
            push(`${pathname}?${params.toString()}`);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") handleSubmit();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8 text-[min(calc(((100vw-128px))/20),16px)]">
                <div className="flex gap-2 mb-4">
                    <input
                        type="search"
                        maxLength={100}
                        placeholder="만화책 제목 검색"
                        defaultValue={searchParams.get(QUERY)?.toString()}
                        onChange={(event) =>
                            handleSearchParamsChange(event.currentTarget.value)
                        }
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 sm:py-3 border-2 border-input-border rounded-lg focus:ring-2 ring-button-bg outline-none bg-white/50"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isSearching}
                        aria-label="검색"
                        aria-disabled={isSearching}
                        className="bg-button-bg text-text-primary px-4 sm:px-6 py-2 sm:py-3  rounded-lg hover:bg-button-bg-hover transition-colors flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSearching ? (
                            <>
                                {/* <Loader2 className="h-4 w-4 animate-spin" /> */}
                                <span>영상 찾는 중...</span>
                            </>
                        ) : (
                            <>
                                {/* <Search className="w-[min(calc(((100vw-128px))/20),16px)] h-[min(calc(((100vw-128px))/20),16px)]" /> */}
                                검색
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
