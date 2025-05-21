export default async function Page({
    params,
}: {
    params: Promise<{ videoId: string }>;
}) {
    const videoId = (await params).videoId;

    return <div>{videoId}</div>;
}
