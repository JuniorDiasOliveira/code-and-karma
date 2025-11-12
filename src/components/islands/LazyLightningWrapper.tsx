import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';

const LazyLightningFX = lazy(() => import('./Light-FX.tsx').then(module => ({ default: module.LightningFX })));

interface LazyLightningWrapperProps {
  children: React.ReactNode;
  minDelayMs?: number;
  maxDelayMs?: number;
  strongCountRange?: [number, number];
  weakCountRange?: [number, number];
  hue?: number;
  allAtOnceChance?: number;
}

export function LazyLightningWrapper({
  children,
  minDelayMs = 3000,
  maxDelayMs = 12000,
  strongCountRange = [2, 4],
  weakCountRange = [1, 3],
  hue = 200,
  allAtOnceChance = 0.2
}: LazyLightningWrapperProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShouldLoad(true), 500);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!shouldLoad) {
    return (
      <div ref={sectionRef}>
        {children}
      </div>
    );
  }

  return (
    <Suspense fallback={<div>{children}</div>}>
      <LazyLightningFX
        minDelayMs={minDelayMs}
        maxDelayMs={maxDelayMs}
        strongCountRange={strongCountRange}
        weakCountRange={weakCountRange}
        hue={hue}
        allAtOnceChance={allAtOnceChance}
      >
        {children}
      </LazyLightningFX>
    </Suspense>
  );
}