import React from "react";
import type { PortfolioGridProps } from "../../types";

type Columns = 3 | 4;

function normalizeCategory(input: unknown): string[] {
    // null/undefined -> []
    if (input == null) return [];

    // 이미 배열이면 문자열만 남기고 trim
    if (Array.isArray(input)) {
        return input
            .map((x) => String(x).trim())
            .filter(Boolean);
    }

    // 문자열이면:
    // - "['a','b']" 또는 '["a","b"]' 같은 JSON 문자열
    // - "{a,b}" 같은 postgres array 문자열
    // - "a,b" 같은 일반 문자열
    if (typeof input === "string") {
        const s = input.trim();
        if (!s) return [];

        // JSON 배열 문자열이면 파싱 시도
        if ((s.startsWith("[") && s.endsWith("]")) || (s.startsWith('"[') && s.endsWith(']"'))) {
            try {
                const parsed = JSON.parse(s);
                if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
            } catch { }
        }

        // postgres array 형태: {a,b} 또는 {"a","b"}
        const cleaned = s.replace(/^\{|\}$/g, ""); // { } 제거
        if (!cleaned.trim()) return [];

        return cleaned
            .split(",")
            .map((x) => x.trim().replace(/^"+|"+$/g, "")) // 양쪽 " 제거
            .filter(Boolean);
    }

    // 그 외는 string으로 바꿔서 1개짜리로 처리할지/버릴지 선택
    return [];
}

const getResponsiveCols = (cols: Columns) => {
    return cols === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";
};

type ExtraProps = {
    getItemClassName?: (index: number) => string; // ✅ 추가
};

const PortfolioGrid: React.FC<PortfolioGridProps & ExtraProps> = ({
    portfolio,
    columns = 3,
    onCardClick,
    gapX = 3,
    gapY = 7,
    showReadMore = true,
    readMoreText = "Read More",
    className,
    getItemClassName, // ✅ 추가
}) => {
    const gapStyle: React.CSSProperties = {
        columnGap: `${gapX * 0.25}rem`,
        rowGap: `${gapY * 0.25}rem`,
    };

    return (
        <section className={className}>
            <div className="mx-auto max-w-7xl px-4 xl:px-0 py-8">
                <div className={`grid ${getResponsiveCols(columns)}`} style={gapStyle}>
                    {portfolio.map((p, i) => (
                        <article
                            key={p.id}
                            className={[
                                "cursor-pointer overflow-hidden rounded-xl bg-white shadow-[0px_8px_70px_rgba(0,0,0,0.05)]",
                                getItemClassName?.(i) ?? "", // ✅ 외부에서 애니메이션 주입
                            ].join(" ")}
                            onClick={() => onCardClick?.(p)}
                        >
                            {/* image */}
                            <div className="group relative overflow-hidden">
                                <img src={p.imageUrl} alt={p.title} className="w-full h-[220px] object-cover" />

                                {/* hover overlay */}
                                {showReadMore && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/20 opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                if (p.readMoreUrl) {
                                                    window.open(p.readMoreUrl, "_blank", "noopener,noreferrer");
                                                    return;
                                                }

                                                onCardClick?.(p); // url 없으면 기존 동작(옵션)
                                            }}
                                            className="inline-flex items-center justify-center rounded-full bg-[#401d1c] px-7 py-3 text-white font-medium transition hover:bg-[#A11D18]"
                                        >
                                            {readMoreText}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* body */}
                            <div className="p-7">
                                <div className="flex flex-wrap items-center gap-2">
                                    {normalizeCategory(p.category).map((t, idx, arr) => (
                                        <span key={`${t}-${idx}`} className="text-sm font-semibold text-[#A11D18]">
                                            {t}
                                            {idx !== arr.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="mt-3 w-[95%] text-[20px] font-medium leading-snug text-slate-900">
                                    <span className="transition hover:text-blue-600">{p.title}</span>
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortfolioGrid;
