import React from "react";
import { AreaCard } from "./AreaCard";
import { ServiceBox } from "./ServiceBox";
import { Helmet } from "react-helmet-async";

const BusinessAreas: React.FC = () => {
    return (
        <section className="relative py-20 lg:py-20 xl:py-24 px-6 flex flex-col items-center overflow-hidden text-black
          bg-[url('/images/bg.png')] bg-[length:100%_100%]
        ">
            <Helmet>
                <title>마케팅 서비스 | 화경마케팅</title>

                <meta name="description" content="검색광고, 네이버 블로그 마케팅, 플레이스 광고, 체험단 운영, 기자단 운영 등 브랜드 노출과 검색 유입을 극대화하는 맞춤형 온라인 마케팅 서비스를 제공합니다." />

                <meta property="og:title" content="마케팅 서비스 | 화경마케팅" />
                <meta property="og:description" content="검색광고, 블로그 광고, 플레이스 광고, 체험단 및 기자단 운영 서비스를 제공합니다." />
            </Helmet>
            {/* 1. 상단 헤더 섹션 */}
            <div className="animate_right text-center py-20 lg:py-24 xl:py-28">
                <h2 id="batang" className="text-[56px] font-bold tracking-tight text-black mb-4">사업영역</h2>
                <p className="text-lg text-black/50 font-medium">우리는 이런 사업을 하고있어요</p>
            </div>

            <div className="animate_top max-w-6xl w-full space-y-24">
                {/* 2. 주요 광고 서비스 카드 (3컬럼) */}
                <div className="grid md:grid-cols-3 gap-8">
                    <AreaCard
                        imgSrc="/images/search-icon.png"
                        alt="검색광고"
                        title="검색광고"
                        description={
                            <>
                                사용자가 검색한 키워드에 맞춰 광고를 진행하는<br />
                                가장 직접적이고 효율적인 퍼포먼스 마케팅 방식입니다.
                            </>
                        }
                    />

                    <AreaCard
                        imgSrc="/images/blog-icon.png"
                        alt="브랜드블로그 광고"
                        title="브랜드블로그 광고"
                        description={
                            <>
                                신뢰도 높은 콘텐츠로 브랜드 이미지를 구축하고,<br />
                                검색을 통해 고객 유입을 연결하는 콘텐츠 중심의 마케팅입니다.
                            </>
                        }
                    />

                    <AreaCard
                        imgSrc="/images/place-icon.png"
                        alt="플레이스 광고"
                        title="플레이스 광고"
                        description={
                            <>
                                리뷰, 사진, 키워드 최적화를 통해 검색을 극대화하는<br />
                                맞춤형 온라인 마케팅 서비스입니다.
                            </>
                        }
                    />
                </div>

                {/* 3. 블로그 마케팅 서비스 상세 안내 (박스 형태) */}
                <ServiceBox
                    boxTitle="블로그 마케팅 서비스 안내"
                    left={{
                        iconSrc: "/images/group-icon.png",
                        iconAlt: "체험단",
                        title: "체험단 운영 서비스",
                        items: [
                            "클린 IP 기반의 안정적인 포스팅 유지",
                            "잠재 고객을 파고드는 정밀 키워드 설계",
                            "전문성을 녹여낸 고퀄리티 브랜딩 콘텐츠",
                        ],
                    }}
                    right={{
                        iconSrc: "/images/reporter-icon.png",
                        iconAlt: "기자단",
                        title: "기자단 운영 서비스",
                        items: ["기본 썸네일 제작", "새 작성 원고 및 고급 이미지", "클린 IP 기반의 안정적인 포스팅 유지"],
                    }}
                />
            </div>
        </section>
    );
};

export default BusinessAreas;
