import { supabaseAxios } from "../lib/supabaseAxios";

export type ClientRow = {
    id: number;
    name: string | null;
    image_url: string;
    created_at: string;
};

export async function getClients() {
    const res = await supabaseAxios.get<ClientRow[]>("/clients", {
        params: {
            select: "id,name,image_url,created_at",
            order: "created_at.asc",
        },
    });
    return res.data;
}