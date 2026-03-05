import type { VercelRequest, VercelResponse } from "@vercel/node";

export function requireAdmin(req: VercelRequest, res: VercelResponse) {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
        res.status(500).json({ ok: false, message: "ADMIN_SECRET not set" });
        return false;
    }

    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token || token !== secret) {
        res.status(401).json({ ok: false, message: "Unauthorized" });
        return false;
    }
    return true;
}