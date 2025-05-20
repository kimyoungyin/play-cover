import InputBox from "@/app/music/search/InputBox";
import YoutubeSearchResult from "@/app/music/search/YoutubeSearchResult";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";

    return (
        <main>
            <h1 className="sr-only">커버할 유튜브 영상 검색</h1>
            <InputBox />
            <YoutubeSearchResult query={query} />
        </main>
    );
}
