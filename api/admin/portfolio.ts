import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "./_auth.js";
import { supabaseAdmin } from "./_supabase.js";

type PortfolioRow = {
    id: number;
    title: string;
    image_url: string;
    read_more_url: string | null;
    is_main: boolean;
    category: string[];
    created_at: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!requireAdmin(req, res)) return;

    try {
        if (req.method === "GET") {
            const { data, error } = await supabaseAdmin
                .from("portfolio")
                .select("id,title,image_url,read_more_url,is_main,category,created_at")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return res.status(200).json({ ok: true, data });
        }

        if (req.method === "POST") {
            const body = req.body ?? {};
            const payload = {
                title: String(body.title ?? "").trim(),
                image_url: String(body.image_url ?? "").trim(),
                read_more_url: body.read_more_url ? String(body.read_more_url).trim() : null,
                is_main: Boolean(body.is_main ?? false),
                category: Array.isArray(body.category) ? body.category.map(String) : [],
            };

            if (!payload.title || !payload.image_url) {
                return res.status(400).json({ ok: false, message: "title/image_url 필수" });
            }

            const { data, error } = await supabaseAdmin
                .from("portfolio")
                .insert(payload)
                .select("*")
                .single();

            if (error) throw error;

            if (payload.is_main === true) {
                await enforceMainLimit8();
            }
            return res.status(200).json({ ok: true, data });
        }

        if (req.method === "PATCH") {
            const body = req.body ?? {};
            const id = Number(body.id);
            if (!id) return res.status(400).json({ ok: false, message: "id 필요" });

            const patch: any = {};
            if (body.title !== undefined) patch.title = String(body.title).trim();
            if (body.image_url !== undefined) patch.image_url = String(body.image_url).trim();
            if (body.read_more_url !== undefined) patch.read_more_url = body.read_more_url ? String(body.read_more_url).trim() : null;
            if (body.is_main !== undefined) patch.is_main = Boolean(body.is_main);
            if (body.category !== undefined) patch.category = Array.isArray(body.category) ? body.category.map(String) : [];

            const { data, error } = await supabaseAdmin
                .from("portfolio")
                .update(patch)
                .eq("id", id)
                .select("*")
                .single();

            if (error) throw error;

            if (patch.is_main === true) {
                await enforceMainLimit8();
            }

            return res.status(200).json({ ok: true, data });
        }

        if (req.method === "DELETE") {
            const id = Number((req.query.id as string) ?? 0);
            if (!id) return res.status(400).json({ ok: false, message: "id 필요" });

            const { error } = await supabaseAdmin.from("portfolio").delete().eq("id", id);
            if (error) throw error;
            return res.status(200).json({ ok: true });
        }

        return res.status(405).json({ ok: false, message: "Method Not Allowed" });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ ok: false, message: e?.message ?? "Server error" });
    }
}

async function enforceMainLimit8() {
    // 최신 created_at 기준으로 메인 8개만 유지, 나머지는 false
    const { data, error } = await supabaseAdmin
        .from("portfolio")
        .select("id")
        .eq("is_main", true)
        .order("created_at", { ascending: false });

    if (error) throw error;

    const ids = (data ?? []).map((x) => x.id);
    const overflow = ids.slice(8);

    if (overflow.length > 0) {
        const { error: updError } = await supabaseAdmin
            .from("portfolio")
            .update({ is_main: false })
            .in("id", overflow);

        if (updError) throw updError;
    }
}