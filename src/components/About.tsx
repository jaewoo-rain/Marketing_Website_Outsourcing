
import React from "react";
import ClientsAutoSlider from "./main/ClientsAutoSlider";
import { Helmet } from "react-helmet-async";

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 bg-white overflow-hidden
    bg-[url('/images/bg.png')] bg-[length:100%_100%]">
      <Helmet>
        <title>화경마케팅 소개 | 온라인 마케팅 전문</title>

        <meta name="description" content="화경마케팅은 검색광고, 블로그 마케팅, 플레이스 광고 등 온라인 마케팅 전략을 통해 브랜드 성장을 지원하는 전문 마케팅 파트너입니다." />

        <meta property="og:title" content="화경마케팅 소개" />
        <meta property="og:description" content="브랜드 성장을 위한 온라인 마케팅 전문 파트너 화경마케팅입니다." />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* 회사 소개 메인 콘텐츠 */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-24">
          <div className="space-y-8 mt-20">
            <div >
              <h2 id="batang" className="text-5xl md:text-6xl font-black leading-tight text-black mb-8">
                안녕하세요
                <br />
                <span className="text-[#A11D18]">화경 마케팅</span>입니다.
              </h2>
            </div>

            <div className="space-y-6 text-black/80">
              <div id="pretendard" className="text-lg leading-relaxed">
                <p>현직 마케터가 <strong className="text-black font-bold">소수정예 대표님들</strong>을 모집하여 브랜드 블로그 관리 대행을 하고 있습니다.</p>
                최적화 키워드 뽑아내어 직접 작성한 원고를 작성하고 있습니다.
              </div>

              <div id="pretendard" className="text-lg leading-relaxed">
                <p>다양한 대표님들을 만나며 가장 많이 듣는 고민은 <strong className="text-[#A11D18] font-bold">'마케팅 비용'</strong> 이었습니다. </p>
                솔직히, 저도 '블로그'만으로 높은 금액의 제안 드리기가 죄송스러웠습니다.
              </div>

              <div className="py-8 rounded-2xl">
                <p className="text-2xl font-bold text-black mb-3">
                  그래서 준비했습니다.
                </p>
                <p className="text-3xl font-black text-[#A11D18]">
                  업계 최대 수준의 최저가.
                </p>
              </div>

              <div id="pretendard" className="text-lg leading-relaxed">
                <p>최저가라고 해서 허술하지 않을까 걱정되시나요?</p>
                <strong className="text-black font-bold">아닙니다.</strong> 가격과 상관없이,
                <span className="text-[#A11D18] font-bold"> 최고의 퀄리티</span>로 모십니다.
              </div>


            </div>
          </div>

          {/* 이미지 섹션 */}
          <div className="rounded-3xl overflow-hidden shadow-lg border-1 mt-52">
            <img
              src="./images/회사소개_화경이미지.png"
              alt="Team"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
        <div className="pt-6 w-full text-center mb-16">
          <p id="batang" className="text-3xl font-bold text-black leading-relaxed">
            대표님, 블로그 관리는 이제
            <span className="text-[#A11D18]"> '선택'</span>이 아닌 <span className="text-[#A11D18]">'필수'</span>입니다.
          </p>
        </div>

        {/* 핵심 가치 타이틀 */}
        <div id="batang" className="text-center text-4xl font-bold py-10 leading-relaxed text-black mb-12 mt-8">
          <div>화경만의 차별화된 서비스</div>
          <div className="text-2xl text-black/60 mt-4">왜 화경을 선택해야 할까요?</div>
        </div>

        {/* 핵심 가치 카드 */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "소수정예 관리",
              desc: "많은 클라이언트보다 소수의 대표님들께 집중된 케어와 최고의 결과물을 제공합니다.",
              icon: "./images/TypewriterWithPaper.png",
            },
            {
              title: "키워드 최적화",
              desc: "검색 엔진 알고리즘을 분석하여 최적화된 키워드로 상위 노출을 보장합니다.",
              icon: "./images/Goal.png",
            },
            {
              title: "직접 작성 원고",
              desc: "AI나 외주가 아닌, 현직 마케터가 직접 작성한 고퀄리티 콘텐츠를 제공합니다.",
              icon: "./images/Handshake.png",
            },
          ].map((val, i) => (
            <div
              key={i}
              className="bg-white border-2 border-black/10 p-8 rounded-3xl hover:border-[#A11D18] hover:shadow-xl transition-all group"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                <img src={val.icon} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-black">{val.title}</h4>
              <p id="pretendard" className="text-black/70 leading-relaxed text-base">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <section id="OurClient" className="py-20 mt-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-3">
            <div id="batang" className="text-black text-4xl font-bold leading-10 mb-6">화경과 함께한 파트너사</div>
            <div className="text-black text-md font-normal leading-5">수많은 성공 사례로 검증된 화경만의 공식을 바탕으로 브랜드가 직면한 불확실성을 독보적인 확신으로 바꿔 드립니다.</div>
          </div>
          <div className="mt-20">
            <ClientsAutoSlider />
          </div>
        </div>
      </section>
    </section>
  );
};

export default About;