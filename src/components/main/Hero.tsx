import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="pt-32 px-6 overflow-hidden animate_top ">
      <div className="max-w-7xl font-bold pb-3 sm:pb-32 mx-auto text-center relative">

        <img
          src="images/icon-mainp-logo.png"
          alt="화경 로고"
          className="
            absolute
            right-0
            top-0
            w-40 md:w-52
            pointer-events-none
          "
        />

        <div className="h-32"></div>

        <div id="batang" className="inline-block px-4 sm:py-1.5 rounded-full text-black text-lg sm:text-2xl tracking-widest mb-6">
          당신의 브랜드에 꽃을 피우다
        </div>

        <h1 id="batang" className="text-2xl md:text-7xl font-black mb-8 leading-[1.1]">
          "
          <span className="text-[#A11D18]">내 브랜드</span>
          처럼,
          <span className="text-[#A11D18]">내 마음</span>
          처럼"
        </h1>

        <p id="batang" className="text-xl text-black max-w-3xl mx-auto mb-10">
          고객의 브랜드를 가장 효율적으로 성장시키는 마케팅 파트너 '화경'입니다
        </p>

        <div className="flex justify-center mt-12">
          <button id="pretendard" className="bg-transparent border-2 border-[#a62118] text-[#a62118] px-8 py-1 rounded-full font-bold transition-all hover:bg-[#a62118] hover:text-white">
            신청하기
          </button>
        </div>
      </div>
      {/* 타이틀 */}
      <div
        data-animate
        id="batang"
        className="text-center text-lg sm:text-4xl py-10 leading-relaxed
                   opacity-0 translate-y-4
                   transition-all duration-700 ease-out"
      >
        <div>증명된 성과, 압도적 신뢰</div>
        <div>지속 가능한 파트너십을 결과로 증명합니다</div>
      </div>
    </section>
  );
};

export default Hero;
