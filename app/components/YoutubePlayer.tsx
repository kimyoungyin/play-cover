"use client";

import YouTube from "react-youtube";

interface YoutubePlayerProps {
    videoId: string;
    height?: string;
    width?: string;
}

export default function YoutubePlayer({
    videoId,
    height = "450",
    width = "100%",
}: YoutubePlayerProps) {
    const opts = {
        height,
        width,
        playerVars: {
            autoplay: 0 as const,
            modestbranding: 1 as const,
            rel: 0 as const,
        },
    };

    return <YouTube videoId={videoId} opts={opts} className="w-full" />;
}
