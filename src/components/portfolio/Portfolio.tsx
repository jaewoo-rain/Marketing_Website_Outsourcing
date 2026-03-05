import React, { useState, useEffect, useMemo } from "react";
import type { PortfolioItem } from "../../types";
import { DEFAULT_PORTFOLIO } from "../../constants/portfolio";
import PortfolioGrid from "./PortfolioGrid";
import { useInViewOnce } from "../../hooks/useInViewOnce"; // 경로 맞게
import { Helmet } from "react-helmet-async";
import { getPortfolioAll } from "../../api/portfolio";

interface PortfolioProps {
  items?: PortfolioItem[];
}

function animClass({
  inView,
  delayMs,
  from = "up",
}: {
  inView: boolean;
  delayMs: number;
  from?: "up" | "left" | "right";
}) {
  const base =
    "transition-all duration-700 ease-out will-change-transform will-change-opacity";
  const delay = `delay-[${delayMs}ms]`;

  if (!inView) {
    const translate =
      from === "up"
        ? "translate-y-8"
        : from === "left"
          ? "-translate-x-8"
          : "translate-x-8";
    return [base, delay, "opacity-0", translate, "blur-[2px]"].join(" ");
  }

  return [base, delay, "opacity-100", "translate-y-0", "translate-x-0", "blur-0"].join(" ");
}

const Portfolio: React.FC<PortfolioProps> = ({ items }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // ✅ 페이지 바뀔 때 카드 애니메이션을 다시 시작하기 위한 key
  const [animKey, setAnimKey] = useState(0);

  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  const columns = 3;
  const rows = 3;
  const perPage = columns * rows;

  useEffect(() => {
    setPage(1);
  }, [portfolio.length]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const rows = await getPortfolioAll();

      const mapped: PortfolioItem[] = rows.map((r) => ({
        id: r.id,
        title: r.title,
        imageUrl: r.image_url,
        readMoreUrl: r.read_more_url,
        isMain: r.is_main,
        category: r.category ?? [], // ✅ null이면 빈 배열
      }));

      setPortfolio(mapped);
    } catch (error) {
      console.error("Portfolio 로드 실패:", error);
      setPortfolio(DEFAULT_PORTFOLIO); // fallback 유지 가능
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (items && items.length > 0) setPortfolio(items);
    else void fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);


  const totalPages = Math.max(1, Math.ceil(portfolio.length / perPage));

  const pagedPortfolio = useMemo(() => {
    const start = (page - 1) * perPage;
    return portfolio.slice(start, start + perPage);
  }, [portfolio, page, perPage]);

  const goToPage = (n: number) => {
    if (n < 1) n = 1;
    if (n > totalPages) n = totalPages;
    setPage(n);
    setAnimKey((k) => k + 1); // ✅ 페이지 바뀌면 애니메이션 재시작
  };

  if (loading) {
    return (
      <section id="portfolio" className="py-24 px-6 bg-white/[0.02] ">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">포트폴리오를 불러오는 중...</p>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref} id="portfolio" className="relative py-20 lg:py-20 xl:py-24
          bg-[url('/images/bg.png')]
          bg-cover
          bg-center
          bg-no-repeat
    ">
      <Helmet>
        <title>마케팅 포트폴리오 | 화경마케팅</title>

        <meta name="description" content="화경마케팅이 진행한 블로그 마케팅, 플레이스 광고, 검색광고 및 다양한 온라인 마케팅 프로젝트 사례를 확인하세요." />

        <meta property="og:title" content="마케팅 포트폴리오 | 화경마케팅" />
        <meta property="og:description" content="온라인 마케팅 프로젝트와 성공 사례를 소개합니다." />
      </Helmet>

      {/* 상단 부분 */}
      <section className="py-20 lg:py-24 xl:py-28">
        <div className="text-center">
          <h2 id="batang" className={animClass({ inView, delayMs: 0, from: "up" }) + " text-[48px] font-extrabold tracking-tight text-black"}>
            Portfolio
          </h2>

          <p className={animClass({ inView, delayMs: 120, from: "up" }) + " mt-3 text-lg text-black/60"}>
            단순한 포트폴리오를 넘어 비즈니스의 해답이 된 레퍼런스들
          </p>
        </div>
      </section>

      {portfolio.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">아직 등록된 포트폴리오가 없습니다.</p>
        </div>
      ) : (
        <section>
          {/* Grid도 살짝 등장 */}
          <PortfolioGrid
            key={animKey} // 카드 딜레이가 다시 적용되게
            portfolio={pagedPortfolio}
            columns={3}
            onCardClick={(item) => console.log("클릭:", item.title)}
            gapX={3}
            gapY={7}
            className={animClass({ inView, delayMs: 200, from: "up" })}
            getItemClassName={(index) => {
              // 카드 순차 등장 (0~8)
              const baseDelay = 260;
              const step = 90;
              return animClass({
                inView,
                delayMs: baseDelay + index * step,
                from: "up",
              });
            }}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={animClass({ inView, delayMs: 420, from: "up" }) + " mt-10 flex items-center justify-center gap-3"}>
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="inline-flex h-8 w-8 items-center text-black justify-center rounded-full bg-white text-xs font-medium shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black sm:h-10 sm:w-10 sm:text-base"
                aria-label="Previous page"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(0, 8)
                .map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goToPage(n)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition hover:bg-black hover:text-white sm:h-10 sm:w-10 sm:text-base ${n === page ? "bg-black text-white" : "bg-white text-black"
                      }`}
                    aria-label={`Page ${n}`}
                  >
                    {n}
                  </button>
                ))}

              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center text-black rounded-full bg-white text-xs font-medium shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black sm:h-10 sm:w-10 sm:text-base"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Portfolio;
