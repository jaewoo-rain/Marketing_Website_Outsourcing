import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";

export const config = {
    api: {
        bodyParser: false, // ✅ 파일 업로드용
    },
};

function getExt(filename = "") {
    const idx = filename.lastIndexOf(".");
    return idx >= 0 ? filename.slice(idx) : "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, message: "Method Not Allowed" });
    }

    try {
        // ✅ Vercel Node runtime에서 req를 Web API Request로 바꿔서 formData 읽기
        const origin = `https://${req.headers.host}`;
        const webReq = new Request(origin + req.url!, {
            method: "POST",
            headers: req.headers as any,
            body: req as any,
        });

        const formData = await webReq.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return res.status(400).json({ ok: false, message: "file이 필요합니다." });
        }

        // 폴더 분리(원하는대로)
        const folder = String(formData.get("folder") ?? "uploads").trim();
        const safeFolder = folder.replaceAll("..", "").replaceAll("\\", "/");

        const originalName = file.name || "upload";
        const ext = getExt(originalName).toLowerCase();
        const key = `${safeFolder}/${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;

        // ✅ 포트폴리오/클라이언트 이미지는 public 추천
        const blob = await put(key, file, {
            access: "public", // ⭐ public 추천 (지금 private라면 바꿔도 됨)
            contentType: file.type || "application/octet-stream",
            addRandomSuffix: false, // key에 이미 랜덤 붙였음
        });

        return res.status(200).json({ ok: true, url: blob.url, pathname: blob.pathname });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ ok: false, message: e?.message || "upload failed" });
    }
}