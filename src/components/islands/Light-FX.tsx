import { useEffect, useMemo, useRef, useState, Children, isValidElement, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LightningFX (window-flash version, visual only)
 * - Sem áudio
 * - Chance de disparar todos de uma vez
 */

type Range2 = [number, number];
type LightiningFXType = {
    children?: ReactNode;
    minDelayMs?: number;
    maxDelayMs?: number;
    hue?: number;
    strongCountRange?: Range2;
    weakCountRange?: Range2;
    strongIntensity?: Range2;
    weakIntensity?: Range2;
    strongDurationMs?: Range2;
    weakDurationMs?: Range2;
    betweenPulseGapMs?: Range2;
    allAtOnceChance?: number;
}

export function LightningFX({
    children,
    minDelayMs = 5000,
    maxDelayMs = 16000,
    hue = 220,
    strongCountRange = [3, 3],
    weakCountRange = [2, 2],
    strongIntensity = [0.78, 0.98],
    weakIntensity = [0.28, 0.55],
    strongDurationMs = [90, 150],
    weakDurationMs = [110, 180],
    betweenPulseGapMs = [60, 180],
    allAtOnceChance = 0.15,
}: LightiningFXType) {
    const [isBursting, setIsBursting] = useState(false);
    const [pulseKey, setPulseKey] = useState(0);
    const [intensity, setIntensity] = useState(0);
    const scheduleNext = useRef<number | null>(null);

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const rint = (min: number, max: number) => Math.floor(rand(min, max + 1));

    // separa children em conteúdo e silhuetas
    const childrenArray = Children.toArray(children);
    const content: ReactNode[] = [];

    childrenArray.forEach((child) => {
        if (
            isValidElement(child)
        ) {
            content.push(child);
        }
    });

    useEffect(() => {
        const loop = () => {
            const delay = rand(minDelayMs, maxDelayMs);
            scheduleNext.current = window.setTimeout(() => {
                runBurst();
                loop();
            }, delay) as unknown as number;
        };
        loop();
        return () => {
            if (scheduleNext.current) window.clearTimeout(scheduleNext.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minDelayMs, maxDelayMs]);

    const makePulse = (kind: "strong" | "weak") => {
        const intensityRange = kind === "strong" ? strongIntensity : weakIntensity;
        const durRange = kind === "strong" ? strongDurationMs : weakDurationMs;
        return {
            kind,
            intensity: clamp01(rand(intensityRange[0], intensityRange[1])),
            duration: Math.max(60, Math.round(rand(durRange[0], durRange[1]))),
        };
    };

    const shuffle = <T,>(a: T[]): T[] => {
        const arr = a.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const runBurst = () => {
        const strongCount = rint(strongCountRange[0], strongCountRange[1]);
        const weakCount = rint(weakCountRange[0], weakCountRange[1]);

        const pulses = [
            ...Array.from({ length: strongCount }, () => makePulse("strong")),
            ...Array.from({ length: weakCount }, () => makePulse("weak")),
        ];

        // Chance de todos juntos
        if (Math.random() < allAtOnceChance) {
            const combinedIntensity = Math.max(...pulses.map((p) => p.intensity)) * 1.1;
            const duration = Math.max(...pulses.map((p) => p.duration));
            setIsBursting(true);
            setIntensity(clamp01(combinedIntensity));
            setPulseKey((k) => k + 1);
            window.setTimeout(() => {
                setIsBursting(false);
                setIntensity(0);
            }, duration + 120);
            return;
        }

        const mixed = shuffle(pulses);
        setIsBursting(true);

        const playNext = (idx: number) => {
            if (idx >= mixed.length) {
                setIsBursting(false);
                setIntensity(0);
                return;
            }
            const p = mixed[idx];
            setIntensity(p.intensity);
            setPulseKey((k) => k + 1);
            const gap = rand(betweenPulseGapMs[0], betweenPulseGapMs[1]);
            window.setTimeout(() => playNext(idx + 1), p.duration + gap);
        };

        playNext(0);
    };

    const overlayColor = useMemo(() => {
        return (alpha: number) => `hsl(${hue} 100% 98% / ${alpha})`;
    }, [hue]);

    return (
        <div className="relative isolate">
            {/* conteúdo "normal" */}
            {content}

            {/* flash */}
            <AnimatePresence initial={false}>
                {isBursting && intensity > 0 && (
                    <motion.div
                        key={`flash-${pulseKey}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, intensity, intensity * 0.15, intensity * 0.65, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16, times: [0, 0.18, 0.35, 0.7, 1], ease: [0.2, 0.8, 0.2, 1] }}
                        className="pointer-events-none absolute inset-0 z-40 mix-blend-screen"
                        style={{ background: overlayColor(Math.min(1, intensity)) }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default LightningFX;