import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// S3 클라이언트 초기화
export const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

/**
 * S3에 파일을 업로드하는 함수
 * @param file - 업로드할 파일 (Buffer)
 * @param key - S3에 저장될 파일 경로
 * @returns 업로드된 파일의 URL
 */
export async function uploadToS3(file: Buffer, key: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: file,
        ContentType: "audio/mpeg", // 오디오 파일 타입
        ACL: "public-read", // 공개 읽기 액세스 허용
        CacheControl: "max-age=604800", // 1주일 동안 캐시
    });

    try {
        await s3Client.send(command);
        return getS3FileUrl(key);
    } catch (error) {
        console.error("Failed to upload file to S3:", error);
        throw new Error("파일 업로드에 실패했습니다.");
    }
}

/**
 * S3 파일의 전체 URL을 생성하는 함수
 * @param key - S3 파일 키
 * @returns S3 파일의 전체 URL
 */
export function getS3FileUrl(key: string): string {
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * 파일 키를 생성하는 함수
 * @param userId - 사용자 ID
 * @param fileName - 원본 파일 이름
 * @returns S3에 저장될 파일 키
 */
export function generateFileKey(userId: string, fileName: string): string {
    const timestamp = Date.now();
    return `covers/${userId}/${timestamp}-${fileName}`;
}
