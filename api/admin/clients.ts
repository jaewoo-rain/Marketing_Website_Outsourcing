import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "./_auth";
import { supabaseAdmin } from "./_supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!requireAdmin(req, res)) return;

    try {
        if (req.method === "GET") {
            const { data, error } = await supabaseAdmin
                .from("clients")
                .select("id,name,image_url,link_url,created_at")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return res.status(200).json({ ok: true, data });
        }

        if (req.method === "POST") {
            const body = req.body ?? {};
            const payload = {
                name: String(body.name ?? "").trim(),
                image_url: String(body.image_url ?? "").trim(),
                link_url: body.link_url ? String(body.link_url).trim() : null,
            };

            if (!payload.name || !payload.image_url) {
                return res.status(400).json({ ok: false, message: "name/image_url 필수" });
            }

            const { data, error } = await supabaseAdmin
                .from("clients")
                .insert(payload)
                .select("*")
                .single();

            if (error) throw error;
            return res.status(200).json({ ok: true, data });
        }

        if (req.method === "PATCH") {
            const body = req.body ?? {};
            const id = Number(body.id);
            if (!id) return res.status(400).json({ ok: false, message: "id 필요" });

            const patch: any = {};
            if (body.name !== undefined) patch.name = String(body.name).trim();
            if (body.image_url !== undefined) patch.image_url = String(body.image_url).trim();
            if (body.link_url !== undefined) patch.link_url = body.link_url ? String(body.link_url).trim() : null;

            const { data, error } = await supabaseAdmin
                .from("clients")
                .update(patch)
                .eq("id", id)
                .select("*")
                .single();

            if (error) throw error;
            return res.status(200).json({ ok: true, data });
        }

        if (req.method === "DELETE") {
            const id = Number((req.query.id as string) ?? 0);
            if (!id) return res.status(400).json({ ok: false, message: "id 필요" });

            const { error } = await supabaseAdmin.from("clients").delete().eq("id", id);
            if (error) throw error;
            return res.status(200).json({ ok: true });
        }

        return res.status(405).json({ ok: false, message: "Method Not Allowed" });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ ok: false, message: e?.message ?? "Server error" });
    }
}