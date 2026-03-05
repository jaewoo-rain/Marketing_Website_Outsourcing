import { useEffect } from "react";
import { useInViewOnce } from "../../hooks/useInViewOnce";
import { useCountUp } from "../../hooks/useCountUp";

export default function StatsSection() {
    const { ref, inView } = useInViewOnce<HTMLElement>();

    const percent = useCountUp(inView, { to: 98 });
    const cases = useCountUp(inView, { to: 200 });

    useEffect(() => {
        if (!inView) return;
        const nodes = document.querySelectorAll<HTMLElement>("[data-animate]");
        nodes.forEach((el) => {
            el.classList.remove("opacity-0", "translate-y-4");
            el.classList.add("opacity-100", "translate-y-0");
        });
    }, [inView]);

    return (
        <section
            ref={ref}
            className="px-6 sm:py-16 font-bold"
        >
            {/* 통계 */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
                <div
                    data-animate
                    className="text-center opacity-0 translate-y-4
                     transition-all duration-700 ease-out delay-150"
                >
                    <div id="batang" className="text-4xl sm:text-5xl font-black text-[#A11D18] mb-1 tabular-nums">
                        {percent}%
                    </div>
                    <div className="text-black text-lg font-bold uppercase tracking-widest">
                        재계약
                    </div>
                </div>

                <div
                    data-animate
                    className="text-center opacity-0 translate-y-4
                     transition-all duration-700 ease-out delay-300"
                >
                    <div id="batang" className="text-4xl sm:text-5xl font-black text-[#A11D18] mb-1 tabular-nums">
                        {cases}건
                    </div>
                    <div className="text-black text-lg font-bold uppercase tracking-widest">
                        매출 증가
                    </div>
                </div>
            </div>
        </section>
    );
}
