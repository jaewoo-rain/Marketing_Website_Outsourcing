import axios from "axios";

export type ContactPayload = {
    name: string;
    email: string;
    phone?: string;
    message: string;
    product?: string;
    website?: string; // honeypot
};

type ContactResponse = { ok: boolean; message?: string };

export async function submitContact(payload: ContactPayload) {
    try {
        const res = await axios.post<ContactResponse>("/api/contact", payload, {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        });

        if (!res.data.ok) throw new Error(res.data.message || "전송 실패");
        return res.data;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.message || err?.message || "전송 실패"
        );
    }
}