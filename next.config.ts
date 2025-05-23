import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/a/**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "30mb",
        },
    },
};

export default nextConfig;
