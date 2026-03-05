import { useEffect, useMemo, useState } from "react";
import { getClients } from "../../api/clients";

type Props = {
    durationSec?: number;
    mobileDurationSec?: number;
    rows?: 1 | 2;
    className?: string;
};

export default function ClientsAutoSlider({
    durationSec = 15,
    mobileDurationSec = 30,
    rows = 1,
    className = "",
}: Props) {
    const [isMobile, setIsMobile] = useState(false);

    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const rows = await getClients();
                setImages(rows.map((r) => r.logo_url));
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 639px)");
        const onChange = () => setIsMobile(mq.matches);
        onChange();
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    // const modules = useMemo(() => {
    //     return import.meta.glob("/public/images/clients/*.{png,jpg,jpeg,webp,svg}", {
    //         eager: true,
    //         as: "url",
    //     }) as Record<string, string>;
    // }, []);

    // const images = useMemo(() => {
    //     const list = Object.values(modules);
    //     return list.sort((a, b) => a.localeCompare(b));
    // }, [modules]);

    const canRun = images.length > 0;
    const track = useMemo(() => [...images, ...images], [images]);

    const finalDuration = isMobile ? mobileDurationSec : durationSec;

    return (
        <section className={`w-full ${className}`}>
            <style>{`
        @keyframes client-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

            <div className="w-full overflow-hidden">
                {canRun && (
                    <>
                        <MarqueeRow track={track} durationSec={finalDuration} isMobile={isMobile} />
                        {rows === 2 && (
                            <div className={isMobile ? "mt-[14px]" : "mt-[21px]"}>
                                <MarqueeRow
                                    track={track}
                                    durationSec={finalDuration + (isMobile ? 10 : 5)}
                                    isMobile={isMobile}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

function MarqueeRow({
    track,
    durationSec,
    isMobile,
}: {
    track: string[];
    durationSec: number;
    isMobile: boolean;
}) {
    const [paused, setPaused] = useState(false);

    return (
        <div className="relative w-full">
            <div
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
                className={[
                    "flex items-center",
                    isMobile ? "gap-[14px]" : "gap-[21px]",
                    "will-change-transform",
                ].join(" ")}
                style={{
                    width: "max-content",
                    animation: `client-marquee ${durationSec}s linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                }}
            >
                {track.map((src, i) => (
                    <div
                        key={`${src}-${i}`}
                        className={[
                            isMobile ? "w-[160px] h-[74px]" : "w-[222px] h-[102px]",
                            "shrink-0 flex items-center justify-center bg-white",
                            "border border-gray-200 rounded-lg",
                            "hover:border-gray-400 transition",
                        ].join(" ")}
                    >
                        <img
                            src={src}
                            alt="client"
                            className="w-full h-full object-contain select-none"
                            draggable={false}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
