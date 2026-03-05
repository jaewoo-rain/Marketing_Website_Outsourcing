import axios from "axios";

export const adminApi = axios.create({
    baseURL: "/api/admin",
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

export function setAdminToken(token: string) {
    adminApi.defaults.headers.common.Authorization = `Bearer ${token}`;
}

// ---- Types
export type PortfolioDTO = {
    id: number;
    title: string;
    image_url: string;
    read_more_url: string | null;
    is_main: boolean;
    category: string;
    created_at: string;
};

export type ClientDTO = {
    id: number;
    name: string;
    image_url: string;
    link_url: string | null;
    created_at: string;
};

// ---- Upload
export async function uploadImage(params: {
    token: string;
    file: File;
    folder: "portfolio" | "clients";
}) {
    const { token, file, folder } = params;

    const base64 = await fileToBase64(file);
    const res = await adminApi.post(
        "/upload",
        {
            filename: file.name,
            contentType: file.type || "application/octet-stream",
            base64,
            folder,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.data.ok) throw new Error(res.data.message || "Upload failed");
    return res.data.url as string;
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || "");
            // data:*/*;base64,XXXX 형태 -> XXXX만
            const base64 = result.includes(",") ? result.split(",")[1] : result;
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ---- Portfolio CRUD
export async function adminGetPortfolio() {
    const res = await adminApi.get("/portfolio");
    if (!res.data.ok) throw new Error(res.data.message || "Fetch failed");
    return res.data.data as PortfolioDTO[];
}

export async function adminCreatePortfolio(payload: Partial<PortfolioDTO>) {
    const res = await adminApi.post("/portfolio", payload);
    if (!res.data.ok) throw new Error(res.data.message || "Create failed");
    return res.data.data as PortfolioDTO;
}

export async function adminUpdatePortfolio(payload: Partial<PortfolioDTO> & { id: number }) {
    const res = await adminApi.patch("/portfolio", payload);
    if (!res.data.ok) throw new Error(res.data.message || "Update failed");
    return res.data.data as PortfolioDTO;
}

export async function adminDeletePortfolio(id: number) {
    const res = await adminApi.delete("/portfolio", { params: { id } });
    if (!res.data.ok) throw new Error(res.data.message || "Delete failed");
    return true;
}

// ---- Clients CRUD
export async function adminGetClients() {
    const res = await adminApi.get("/clients");
    if (!res.data.ok) throw new Error(res.data.message || "Fetch failed");
    return res.data.data as ClientDTO[];
}

export async function adminCreateClient(payload: Partial<ClientDTO>) {
    const res = await adminApi.post("/clients", payload);
    if (!res.data.ok) throw new Error(res.data.message || "Create failed");
    return res.data.data as ClientDTO;
}

export async function adminUpdateClient(payload: Partial<ClientDTO> & { id: number }) {
    const res = await adminApi.patch("/clients", payload);
    if (!res.data.ok) throw new Error(res.data.message || "Update failed");
    return res.data.data as ClientDTO;
}

export async function adminDeleteClient(id: number) {
    const res = await adminApi.delete("/clients", { params: { id } });
    if (!res.data.ok) throw new Error(res.data.message || "Delete failed");
    return true;
}