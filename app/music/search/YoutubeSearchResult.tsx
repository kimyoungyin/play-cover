import { fetchYouTubeVideoAndCount } from "@/lib/actions/youtube";
import Link from "next/link";

export default async function YoutubeSearchResult({
    query,
}: {
    query: string;
}) {
    const { videoData, coverCount, errMessage } =
        await fetchYouTubeVideoAndCount(query);

    if (errMessage) {
        // 쿼리도 없이아예 검색도 하기 전
        if (!query) return null;
        // 검색은 했으나 에러 발생
        return <div className="text-red-500">{errMessage}</div>;
    }

    if (!videoData) return null;

    const { snippet, id } = videoData;

    return (
        <figure className="flex flex-col items-start space-x-4 p-4 border rounded-md shadow-md">
            <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1`}
                width={600}
                height={450}
                allowFullScreen
                allow="autoplay; encrypted-media"
            />
            <figcaption>
                <h2 className="text-lg font-semibold text-gray-800">
                    {snippet.title}
                </h2>
                <p className="text-sm text-gray-600">{snippet.description}</p>
                <a
                    href={`https://www.youtube.com/watch?v=${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-2 block"
                >
                    Watch on YouTube
                </a>
                {coverCount > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                        커버곡 {coverCount}개
                    </p>
                )}
                <Link href={`/music/upload/${id}`}>커버곡 업로드</Link>
            </figcaption>
        </figure>
    );
}
