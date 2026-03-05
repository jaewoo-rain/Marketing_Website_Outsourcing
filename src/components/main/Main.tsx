import React from "react";
import Hero from "./Hero";
import type { PortfolioItem } from "../../types";
import PortfolioGrid from "../portfolio/PortfolioGrid";
import StatsSection from "./StatsSection";
import PricingSection from "./PricingSection ";
import AttentionSection from "./AttentionSection";
import { useInViewOnce } from "../../hooks/useInViewOnce";
import ClientsAutoSlider from "./ClientsAutoSlider";
import ContactForm from "../contact/ContactForm";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

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

interface MainProps {
  portfolio: PortfolioItem[];
}

const Main: React.FC<MainProps> = ({ portfolio }) => {


  // 포트폴리오 섹션만 따로 감지
  const { ref: portfolioRef, inView: portfolioInView } =
    useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  const navigate = useNavigate();

  return (
    <main>
      <Helmet>
        <title>화경마케팅 | 블로그 마케팅 · 플레이스 광고 · 검색광고 전문</title>

        <meta name="description" content="화경마케팅은 네이버 블로그 마케팅, 플레이스 광고, 검색광고, 체험단 및 기자단 운영을 통해 브랜드 노출과 고객 유입을 높이는 온라인 마케팅 전문 기업입니다." />

        <meta name="keywords" content="블로그마케팅, 플레이스광고, 검색광고, 네이버마케팅, 체험단마케팅, 기자단마케팅, 온라인마케팅" />

        <meta property="og:title" content="화경마케팅 | 온라인 마케팅 전문" />
        <meta property="og:description" content="블로그 마케팅, 플레이스 광고, 검색광고, 체험단 및 기자단 운영으로 브랜드 노출과 고객 유입을 높입니다." />
      </Helmet>

      <div
        className="
          bg-[url('/images/bg.png')]
          bg-cover
          bg-center
          bg-no-repeat
        "
      >
        <section id="Hero">
          <Hero />
        </section>

        <section id="stateSection">
          <StatsSection />
        </section>

        <section id="PricingSection">
          <PricingSection />
        </section>
      </div>

      <section id="AttentionSection">
        <AttentionSection />
      </section>

      <div
        className="
          bg-[url('/images/bg.png')]
          bg-cover
          bg-center
          bg-no-repeat"
      >
        <section id="OurClient" className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-3">
              <div id="batang" className="text-black text-3xl sm:text-4xl font-bold leading-10 mb-6">화경과 함께한 파트너사</div>
              <div className="text-black text-md font-normal leading-5">수많은 성공 사례로 검증된 화경만의 공식을 바탕으로 브랜드가 직면한 불확실성을 독보적인 확신으로 바꿔 드립니다.</div>
            </div>
            <div className="mt-10">
              <ClientsAutoSlider />
            </div>
          </div>
        </section>

        <section id="portfolio" ref={portfolioRef} className="mb-20">
          <div id="batang" className={animClass({ inView: portfolioInView, delayMs: 0 }) + " text-center pt-10 text-black text-4xl font-bold leading-10 mb-6"}>
            Portfolio
          </div>

          <PortfolioGrid
            portfolio={portfolio}
            columns={4}
            onCardClick={(item) => console.log("클릭:", item.title)}
            gapX={3}
            gapY={7}
            // grid 전체가 먼저 등장
            className={animClass({ inView: portfolioInView, delayMs: 20 })}
            // 카드가 순차적으로 등장 (0~)
            getItemClassName={(index) =>
              animClass({
                inView: portfolioInView,
                delayMs: 200 + index * 80,
                from: "up",
              })
            }
          />

          {/* 더보기 버튼도 마지막에 등장 */}
          <div className={animClass({ inView: portfolioInView, delayMs: 520 }) + " flex justify-center mt-12"}>
            <button
              onClick={() => navigate('/portfolio')}
              className="
              bg-transparent border-2 border-[#a62118] text-[#a62118]
              px-8 py-1 rounded-full font-bold text-s
              inline-flex items-center justify-center
              transition-all duration-300 ease-in-out
              hover:bg-[#a62118] hover:text-white
              hover:scale-105 hover:shadow-lg hover:-translate-y-1
              active:scale-95
            "
            >
              더보기
            </button>
          </div>
        </section>

        <section id="contact" className="relative py-20 px-6 flex flex-col items-center overflow-hidden
           bg-[length:100%_100%] 
      ">
          <div className="w-full max-w-6xl">

            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Main;
