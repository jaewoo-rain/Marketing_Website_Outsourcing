import React from "react";
import type { PortfolioGridProps } from "../../types";

type Columns = 3 | 4;

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
                                    {(() => {
                                        const raw = p.category as unknown;

                                        // 1) 이미 배열이면 그대로
                                        if (Array.isArray(raw)) return raw;

                                        // 2) 문자열이면 { } 제거 후 콤마로 split
                                        if (typeof raw === "string") {
                                            const cleaned = raw.replace(/^\{|\}$/g, ""); // 앞뒤 { } 제거
                                            if (!cleaned.trim()) return [];
                                            return cleaned.split(",").map((s) => s.trim()).filter(Boolean);;
                                        }

                                        // 3) 그 외는 빈 배열
                                        return [];
                                    })().map((t, idx, arr) => (
                                        <span key={`${t}-${idx}`} className="text-sm font-semibold text-[#A11D18]">
                                            {t}
                                            {idx !== arr.length - 1 ? "," : ""}
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
