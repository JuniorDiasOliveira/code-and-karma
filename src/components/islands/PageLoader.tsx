import { useEffect, useMemo, useRef, useState } from "react";

type LoaderMessage = { atMs: number; text: string };

interface PageLoaderProps {
  onLoadComplete: () => void;
  /** Tempo mínimo de exibição do loader (ms). */
  minLoadTime?: number;
  /** Mensagens que mudam ao longo do tempo. */
  messages?: LoaderMessage[];
  /** Atraso após chegar em 100% antes de chamar onLoadComplete (ms). */
  settleDelayMs?: number;
}

const DEFAULT_MESSAGES: LoaderMessage[] = [
  { atMs: 0,    text: "Initializing..." },
  { atMs: 800,  text: "Loading components..." },
  { atMs: 1600, text: "Activating neon effects..." },
  { atMs: 2200, text: "Almost ready..." },
];

// ease-out cúbico para um “fill” elegante
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// clamp util
function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function PageLoader({
  onLoadComplete,
  minLoadTime = 3000,
  messages = DEFAULT_MESSAGES,
  settleDelayMs = 350,
}: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(messages[0]?.text ?? "Loading...");
  const rafId = useRef<number | null>(null);
  const startTs = useRef<number | null>(null);
  const done = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Ordena mensagens uma vez
  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.atMs - b.atMs),
    [messages]
  );

  useEffect(() => {
    // Agendador de mudança de mensagens baseado no tempo decorrido
    let msgIdx = 0;

    const step = (ts: number) => {
      if (startTs.current == null) startTs.current = ts;

      const elapsed = ts - startTs.current;
      // Progresso até 95% controlado por easing; o restante fica para o “settle”
      const target = elapsed < minLoadTime
        ? 95 * easeOutCubic(clamp(elapsed / minLoadTime, 0, 1))
        : 100;

      setProgress((prev) => (target > prev ? clamp(target) : prev));

      // Atualiza mensagem se for hora
      while (
        msgIdx < sortedMessages.length &&
        elapsed >= sortedMessages[msgIdx].atMs
      ) {
        setLoadingText(sortedMessages[msgIdx].text);
        msgIdx++;
      }

      if (elapsed >= minLoadTime && !done.current) {
        done.current = true;
        // Garante 100% visual e pequeno delay para transição suave
        setProgress(100);
        const t = window.setTimeout(() => {
          onLoadComplete();
        }, settleDelayMs);
        // ainda fazemos um raf extra para suavizar
        rafId.current = requestAnimationFrame(() => {});
        return () => window.clearTimeout(t);
      }

      rafId.current = requestAnimationFrame(step);
    };

    rafId.current = requestAnimationFrame(step);

    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [minLoadTime, onLoadComplete, settleDelayMs, sortedMessages]);

  // Classes utilitárias que respeitam reduced motion
  const pulseMaybe = prefersReducedMotion ? "" : "animate-pulse";
  const glowAnim = prefersReducedMotion ? "" : "animate-[pulse_2s_ease-in-out_infinite]";
  const delayedPulse = (delayMs: number) =>
    prefersReducedMotion ? "" : `animate-[pulse_2s_ease-in-out_infinite_${Math.max(0, delayMs)}ms]`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      role="dialog"
      aria-modal="true"
      aria-label="Loading page"
    >
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl bg-primary/20 ${glowAnim}`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full blur-3xl bg-secondary/20 ${delayedPulse(
            1000
          )}`}
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent ${pulseMaybe}`}>
            Neon Blog
          </h1>
        </div>

        {/* Barra de progresso (acessível) */}
        <div className="mb-6">
          <div
            className="relative h-2 w-64 overflow-hidden rounded-full border border-primary/20 bg-muted/20"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Loading progress"
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-primary to-secondary transition-[width] duration-200 ease-out shadow-lg shadow-primary/50"
              style={{ width: `${progress}%` }}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent ${pulseMaybe}`}
              />
            </div>
          </div>
        </div>

        {/* Texto de status */}
        <p className={`text-sm text-muted-foreground ${pulseMaybe}`}>{loadingText}</p>

        {/* Percentual */}
        <p className="mt-2 font-mono text-xs text-primary">{Math.round(progress)}%</p>

        {/* “Raios” decorativos (leves) */}
        <div className="absolute -inset-4 opacity-30 pointer-events-none">
          <div
            className={`absolute left-1/2 top-0 h-8 w-px bg-linear-to-b from-primary to-transparent ${delayedPulse(
              300
            )}`}
          />
          <div
            className={`absolute bottom-0 right-1/3 h-6 w-px bg-linear-to-t from-secondary to-transparent ${delayedPulse(
              700
            )}`}
          />
          <div
            className={`absolute left-0 top-1/2 h-px w-6 bg-linear-to-r from-primary to-transparent ${delayedPulse(
              500
            )}`}
          />
          <div
            className={`absolute right-0 top-1/3 h-px w-8 bg-linear-to-l from-secondary to-transparent ${delayedPulse(
              900
            )}`}
          />
        </div>
      </div>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return prefers;
}
