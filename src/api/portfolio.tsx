import { supabaseAxios } from "../lib/supabaseAxios";

export type PortfolioRow = {
    id: number;
    title: string;
    image_url: string;
    read_more_url: string | null;
    is_main: boolean;
    category: string[] | null;
    created_at: string;
};

export async function getPortfolioAll() {
    const res = await supabaseAxios.get<PortfolioRow[]>("/portfolio", {
        params: {
            select: "id,title,image_url,read_more_url,is_main,category,created_at",
            order: "created_at.desc",
        },
    });
    return res.data;
}

export async function getMainPortfolio() {
    const res = await supabaseAxios.get<PortfolioRow[]>("/portfolio", {
        params: {
            select: "id,title,image_url,read_more_url,is_main,category,created_at",
            is_main: "eq.true",
            order: "created_at.desc",
        },
    });
    return res.data;
}