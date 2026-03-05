import axios from "axios";

export async function uploadImage(file: File, folder: "portfolio" | "clients" = "portfolio") {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    const res = await axios.post<{ ok: boolean; url: string }>(
        "/api/upload",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (!res.data.ok) throw new Error("업로드 실패");
    return res.data.url;
}