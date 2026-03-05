import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { requireAdmin } from "./_auth";

type Body = {
    filename: string;
    contentType: string;
    base64: string;        // 파일 본문(base64)
    folder?: "portfolio" | "clients";
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!requireAdmin(req, res)) return;

    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, message: "Method Not Allowed" });
    }

    try {
        const body = (req.body ?? {}) as Partial<Body>;
        const filename = String(body.filename ?? "").trim();
        const contentType = String(body.contentType ?? "").trim();
        const base64 = String(body.base64 ?? "").trim();
        const folder = (body.folder ?? "portfolio") as Body["folder"];

        if (!filename || !contentType || !base64) {
            return res.status(400).json({ ok: false, message: "필수값 누락" });
        }

        const buffer = Buffer.from(base64, "base64");
        const key = `${folder}/${Date.now()}-${filename}`.replaceAll(" ", "-");

        const blob = await put(key, buffer, {
            access: "public",
            contentType,
        });

        return res.status(200).json({ ok: true, url: blob.url });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ ok: false, message: e?.message ?? "Upload failed" });
    }
}