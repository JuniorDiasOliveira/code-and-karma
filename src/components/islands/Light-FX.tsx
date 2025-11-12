import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

type Range2 = [number, number];

type LightningFXProps = {
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
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const rint = (min: number, max: number) => Math.floor(rand(min, max + 1));
const shuffle = <T,>(a: T[]) => {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

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
}: LightningFXProps) {
  const [isBursting, setIsBursting] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [intensity, setIntensity] = useState(0);

  const loopTimeoutRef = useRef<number | null>(null);
  const pulseTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const loop = () => {
      const delay = rand(minDelayMs, maxDelayMs);
      loopTimeoutRef.current = window.setTimeout(() => {
        runBurst();
        loop();
      }, delay) as unknown as number;
    };
    loop();
    return () => {
      if (loopTimeoutRef.current) window.clearTimeout(loopTimeoutRef.current);
      pulseTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
      pulseTimeoutsRef.current = [];
    };
  }, [minDelayMs, maxDelayMs]);

  const makePulse = (useStrong: boolean) => {
    const iRange = useStrong ? strongIntensity : weakIntensity;
    const dRange = useStrong ? strongDurationMs : weakDurationMs;
    return {
      intensity: clamp01(rand(iRange[0], iRange[1])),
      duration: Math.max(60, Math.round(rand(dRange[0], dRange[1]))),
    };
  };

  const runBurst = () => {
    const strongCount = rint(strongCountRange[0], strongCountRange[1]);
    const weakCount = rint(weakCountRange[0], weakCountRange[1]);

    const pulses = [
      ...Array.from({ length: strongCount }, () => makePulse(true)),
      ...Array.from({ length: weakCount }, () => makePulse(false)),
    ];

    // chance de todos os flashes ao mesmo tempo
    if (Math.random() < allAtOnceChance) {
      const combinedIntensity = Math.max(...pulses.map((p) => p.intensity)) * 1.1;
      const duration = Math.max(...pulses.map((p) => p.duration));
      setIsBursting(true);
      setIntensity(clamp01(combinedIntensity));
      setPulseKey((k) => k + 1);
      const tid = window.setTimeout(() => {
        setIsBursting(false);
        setIntensity(0);
      }, duration + 120) as unknown as number;
      pulseTimeoutsRef.current.push(tid);
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
      const tid = window.setTimeout(() => playNext(idx + 1), p.duration + gap) as unknown as number;
      pulseTimeoutsRef.current.push(tid);
    };

    playNext(0);
  };

  return (
    <div className="relative isolate">
      {children}
      {isBursting && intensity > 0 && (
        <motion.div
          key={`flash-${pulseKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, intensity, intensity * 0.15, intensity * 0.65, 0] }}
          transition={{ duration: 0.16, times: [0, 0.18, 0.35, 0.7, 1], ease: [0.2, 0.8, 0.2, 1] }}
          className="pointer-events-none absolute inset-0 z-40 mix-blend-screen"
          style={{ background: `hsl(${hue} 100% 98% / ${Math.min(1, intensity)})` }}
        />
      )}
    </div>
  );
}

export default LightningFX;
