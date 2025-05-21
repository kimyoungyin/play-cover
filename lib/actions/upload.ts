"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateFileKey, uploadToS3 } from "@/lib/s3";

export async function uploadCover(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("인증이 필요합니다.");
    }

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoId = formData.get("videoId") as string;

    if (!file || !title || !videoId) {
        throw new Error("필수 필드가 누락되었습니다.");
    }

    try {
        // 사용자의 업로드 횟수 확인 (무료 사용자는 5회 제한)
        const userUploads = await prisma.cover.count({
            where: { userId: session.user.id },
        });

        if (userUploads >= 5) {
            throw new Error(
                "무료 사용자는 최대 5개의 커버곡만 업로드할 수 있습니다."
            );
        }

        // 파일을 Buffer로 변환
        const buffer = Buffer.from(await file.arrayBuffer());
        const key = generateFileKey(session.user.id, file.name);

        // S3에 파일 업로드
        const audioUrl = await uploadToS3(buffer, key);

        // 커버 정보 저장
        await prisma.cover.create({
            data: {
                title,
                description,
                videoId,
                audioUrl,
                userId: session.user.id,
            },
        });

        revalidatePath(`/cover/${videoId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to upload cover:", error);
        throw error;
    }
}
