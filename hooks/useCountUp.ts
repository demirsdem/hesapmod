import { useState, useEffect } from "react";

export function useCountUp(endValue: number, duration: number = 1000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const progressRatio = Math.min(progress / duration, 1);

            // Easing function (easeOutExpo)
            const easeOutProgress = progressRatio === 1 ? 1 : 1 - Math.pow(2, -10 * progressRatio);

            setCount(endValue * easeOutProgress);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [endValue, duration]);

    return count;
}
