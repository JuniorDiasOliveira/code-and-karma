import { useState, useEffect } from 'react';

interface PageLoaderProps {
  onLoadComplete: () => void;
  minLoadTime?: number;
}

export function PageLoader({ onLoadComplete, minLoadTime = 3000 }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const startTime = Date.now();
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 10;
      });
    }, 150);

    // Update loading text
    const textTimeout1 = setTimeout(() => setLoadingText('Loading components...'), 800);
    const textTimeout2 = setTimeout(() => setLoadingText('Activating neon effects...'), 1600);
    const textTimeout3 = setTimeout(() => setLoadingText('Almost ready...'), 2400);

    // Complete loading after minimum time
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        onLoadComplete();
      }, 500);
    }, minLoadTime);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(textTimeout1);
      clearTimeout(textTimeout2);
      clearTimeout(textTimeout3);
      clearTimeout(completeTimeout);
    };
  }, [onLoadComplete, minLoadTime]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
            Neon Blog
          </h1>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="relative w-64 h-2 bg-muted/20 rounded-full overflow-hidden border border-primary/20">
            <div 
              className="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out shadow-lg shadow-primary/50"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-muted-foreground text-sm animate-pulse">
          {loadingText}
        </p>

        {/* Percentage */}
        <p className="text-primary font-mono text-xs mt-2">
          {Math.round(progress)}%
        </p>

        {/* Lightning Effects */}
        <div className="absolute -inset-4 opacity-30">
          <div className="absolute top-0 left-1/2 w-px h-8 bg-linear-to-b from-primary to-transparent animate-pulse delay-300"></div>
          <div className="absolute bottom-0 right-1/3 w-px h-6 bg-linear-to-t from-secondary to-transparent animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-0 h-px w-6 bg-linear-to-r from-primary to-transparent animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-0 h-px w-8 bg-linear-to-l from-secondary to-transparent animate-pulse delay-900"></div>
        </div>
      </div>
    </div>
  );
}