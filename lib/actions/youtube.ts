"use server";

import { prisma } from "@/lib/prisma";

// Define a type for YouTube API response data
export interface YouTubeVideo {
    id: string;
    snippet: {
        title: string;
        description: string;
        thumbnails: { default: { url: string } };
    };
}

const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3/videos";

// 유튜브 url 입력하면 거기서 videoId를 가져와서 검색
// 재사용 가능성 있으므로 분리
async function fetchVideoData(
    videoId: string,
    apiKey: string
): Promise<YouTubeVideo> {
    const apiUrl = new URL(YOUTUBE_API_BASE_URL);
    apiUrl.searchParams.append("part", "snippet");
    apiUrl.searchParams.append("id", videoId);
    apiUrl.searchParams.append("videoCategoryId", "10");
    apiUrl.searchParams.append("key", apiKey);

    const response = await fetch(apiUrl.toString(), {
        headers: {
            Referer: "http://localhost:3000",
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.error?.message || "Failed to fetch data from YouTube API"
        );
    }

    const { items } = await response.json();
    return items[0] as YouTubeVideo;
}

export async function fetchYouTubeVideoAndCount(videoUrl: string): Promise<{
    videoData: YouTubeVideo | null;
    coverCount: number;
    errMessage: string | null;
}> {
    async function fetchCoverCount(videoId: string): Promise<number> {
        return prisma.cover.count({
            where: { videoId },
        });
    }

    // 쿼리 없을 때: 첫 렌더링 혹은 비움
    if (!videoUrl) {
        return {
            videoData: null,
            coverCount: 0,
            errMessage: "Video URL parameter is required",
        };
    }

    // Validate if the URL is a YouTube or YouTube Music video URL
    const urlPattern =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com)\//;
    if (!urlPattern.test(videoUrl)) {
        return {
            videoData: null,
            coverCount: 0,
            errMessage: "Invalid YouTube or YouTube Music URL",
        };
    }

    // Extract videoId from the URL
    const videoIdMatch = videoUrl.match(/[?&]v=([^&#]*)|youtu\.be\/([^&#]*)/);
    const videoId = videoIdMatch ? videoIdMatch[1] || videoIdMatch[2] : null;
    if (!videoId) {
        return {
            videoData: null,
            coverCount: 0,
            errMessage: "Unable to extract video ID from the URL",
        };
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return {
            videoData: null,
            coverCount: 0,
            errMessage:
                "YouTube API key is not set in the environment variables",
        };
    }

    const [videoData, coverCount] = await Promise.all([
        fetchVideoData(videoId, apiKey),
        fetchCoverCount(videoId),
    ]);

    return { videoData, coverCount, errMessage: null };
}
