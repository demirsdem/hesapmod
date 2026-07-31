"use client";

import { useEffect, useRef, useState } from "react";

export default function AdSlot({
    id,
    minHeight = 90,
    label = "Reklam",
}: {
    id: string;
    minHeight?: number;
    label?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || visible) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "240px" }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [visible]);

    return (
        <div
            ref={ref}
            id={id}
            aria-label={label}
            className="ad-slot my-6 flex w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500 print:hidden"
            style={{ minHeight }}
        >
            {visible ? label : ""}
        </div>
    );
}
