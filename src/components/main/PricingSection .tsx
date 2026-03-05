import { useInViewOnce } from "../../hooks/useInViewOnce";

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

    return [base, delay, "opacity-100", "translate-y-0", "translate-x-0", "blur-0"].join(
        " "
    );
}

const PricingSection = () => {
    const { ref, inView } = useInViewOnce<HTMLElement>({ threshold: 0.2 });

    return (
        <section ref={ref} className="w-full flex justify-center py-16">
            {/* 전체 컨테이너 */}
            <div className="max-w-[1276px] w-full flex flex-col items-center gap-16 px-6">
                {/* 타이틀 (맨 먼저) */}
                <div
                    id="batang"
                    className={
                        animClass({ inView, delayMs: 0, from: "up" }) +
                        " text-center text-xl sm:text-4xl font-bold leading-relaxed"
                    }
                >
                    <span className="text-red-800">최고의 퀄리티</span>
                    <span className="text-black">를 업계 최대 수준의 </span> <br />
                    <span className="text-red-800">최저가 패키지</span>
                    <span className="text-black">로</span>
                </div>

                {/* 카드 영역 */}
                <div className="w-full flex flex-col gap-9 lg:flex-row lg:justify-center">
                    {/* STANDARD */}
                    <div
                        className={
                            animClass({ inView, delayMs: 150, from: "up" }) +
                            " w-full max-w-[384px] h-[470px] p-5 bg-gradient-to-b from-black to-red-800 rounded-[10px] shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-5"
                        }
                    >
                        <div className="text-center text-white">
                            <div className="text-3xl font-bold">STANDARD</div>
                            <div className="text-xl font-medium">10건/30일</div>
                        </div>

                        <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-3">150,000원</div>
                            <div className="text-xl font-medium">
                                가성비로 시작하는 기초 브랜딩의 정석
                            </div>
                        </div>

                        <ul className="text-white text-base font-medium space-y-1 text-center">
                            <li>노출되는 키워드</li>
                            <li>개인 브랜딩 1000자 이내</li>
                            <li>고급이미지</li>
                            <li>썸네일</li>
                            <li>고정 클린 IP</li>
                        </ul>
                    </div>

                    {/* DELUXE */}
                    <div
                        className={
                            animClass({ inView, delayMs: 300, from: "up" }) +
                            " w-full max-w-[384px] h-[470px] p-5 bg-gradient-to-b from-black to-red-800 rounded-[10px] shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-5"
                        }
                    >
                        <div className="text-center text-white">
                            <div className="text-3xl font-bold">DELUXE</div>
                            <div className="text-xl font-medium">14건/30일</div>
                        </div>

                        <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-3">210,000원</div>
                            <div className="text-xl font-medium">
                                체계적인 이웃 관리로 커뮤니티 영향력 확대
                            </div>
                        </div>

                        <ul className="text-white text-base font-medium space-y-1 text-center">
                            <li>노출되는 키워드</li>
                            <li>개인 브랜딩 1500자 내외</li>
                            <li>고급이미지</li>
                            <li>썸네일 & 바로가기 배너</li>
                            <li>고정 클린 IP</li>
                            <li>이웃 관리</li>
                        </ul>
                    </div>

                    {/* PREMIUM */}
                    <div
                        className={
                            animClass({ inView, delayMs: 450, from: "up" }) +
                            " w-full max-w-[384px] h-[470px] p-5 bg-gradient-to-b from-black to-red-800 rounded-[10px] shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-5"
                        }
                    >
                        <div className="text-center text-white">
                            <div className="text-3xl font-bold">PREMIUM</div>
                            <div className="text-xl font-medium">18건/30일</div>
                        </div>

                        <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-3">300,000원</div>
                            <div className="text-lg font-medium">
                                브랜드 구축부터 노출까지, 올인원 프리미엄 케어
                            </div>
                        </div>

                        <ul className="text-white text-base font-medium space-y-1 text-center">
                            <li>노출되는 키워드</li>
                            <li>개인 브랜딩 2000자 이내</li>
                            <li>홈페이지형 블로그 제작</li>
                            <li>썸네일 & 배너 제작</li>
                            <li>고정 클린 IP</li>
                            <li>이웃 관리</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;