import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { YouTubeEmbed } from "@next/third-parties/google";
import UploadForm from "./components/UploadForm";

export default async function Page({
    params,
}: {
    params: Promise<{ videoId: string }>;
}) {
    const videoId = (await params).videoId;

    // 인증 상태 확인
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="w-full md:w-1/2">
                <YouTubeEmbed videoid={videoId} height={400} />
            </div>
            <div className="w-full md:w-1/2">
                <UploadForm videoId={videoId} />
            </div>
        </div>
    );
}
