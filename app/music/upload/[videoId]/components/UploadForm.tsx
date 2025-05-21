"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { uploadCover } from "@/lib/actions/upload";

interface UploadFormProps {
    videoId: string;
}

interface UploadError extends Error {
    message: string;
}

export default function UploadForm({ videoId }: UploadFormProps) {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // 오디오 파일 타입 체크
            if (!selectedFile.type.startsWith("audio/")) {
                setError("오디오 파일만 업로드 가능합니다.");
                return;
            }
            // 파일 크기 체크 (30MB 제한)
            if (selectedFile.size > 30 * 1024 * 1024) {
                setError("파일 크기는 30MB를 초과할 수 없습니다.");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !session) {
            setError("파일을 선택해주세요.");
            return;
        }

        try {
            setIsUploading(true);
            setError(null);
            setUploadProgress(0);

            // FormData 생성
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("videoId", videoId);

            // Server Action을 사용하여 업로드
            const result = await uploadCover(formData);

            if (result.success) {
                // 성공 후 폼 초기화
                setTitle("");
                setDescription("");
                setFile(null);
                setUploadProgress(100);

                // 성공 메시지 표시
                alert("커버곡이 성공적으로 업로드되었습니다!");
            }
        } catch (err) {
            const error = err as UploadError;
            setError(error.message || "업로드 중 오류가 발생했습니다.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 border rounded-lg"
        >
            <h2 className="text-2xl font-bold mb-6">커버 음원 업로드</h2>

            <div className="space-y-2">
                <label htmlFor="title" className="block font-medium">
                    제목
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="커버곡 제목을 입력하세요"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block font-medium">
                    설명
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md h-32"
                    placeholder="커버곡에 대한 설명을 입력하세요"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="audio" className="block font-medium">
                    오디오 파일
                </label>
                <input
                    type="file"
                    id="audio"
                    accept="audio/*"
                    onChange={handleFileChange}
                    required
                    className="w-full"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            )}

            <button
                type="submit"
                disabled={isUploading || !session}
                className={`w-full py-2 px-4 rounded-md text-white font-medium
                    ${
                        isUploading || !session
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                {isUploading ? "업로드 중..." : "업로드"}
            </button>

            {!session && (
                <p className="text-red-500 text-sm text-center mt-2">
                    업로드하려면 로그인이 필요합니다.
                </p>
            )}
        </form>
    );
}
