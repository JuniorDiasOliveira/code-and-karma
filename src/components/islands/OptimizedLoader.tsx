import { useState, useEffect } from 'react';

interface OptimizedLoaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

export function OptimizedLoader({ children, minLoadTime = 1800 }: OptimizedLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100; 
        if (prev >= 95) return prev;
        return Math.min(100, prev + Math.random() * 8 + 2);
      });
    }, 50);

    // Text updates
    const textUpdates = [
      { delay: 400, text: 'Loading components...' },
      { delay: 800, text: 'Activating effects...' },
      { delay: 1200, text: 'Almost ready...' }
    ];

    const textTimeouts = textUpdates.map(({ delay, text }) =>
      setTimeout(() => setLoadingText(text), delay)
    );

    const completeTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, minLoadTime);

    return () => {
      clearInterval(progressInterval);
      textTimeouts.forEach(timeout => clearTimeout(timeout));
      clearTimeout(completeTimeout);
    };
  }, [minLoadTime]);

  if (isLoading) {
    return (
      <div className="relative flex flex-col bg-background text-foreground min-h-screen">
        {/* Loading Overlay */}
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                Code & Karma
              </h1>
            </div>

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

            <p className="text-muted-foreground text-sm animate-pulse">
              {loadingText}
            </p>

            <p className="text-primary font-mono text-xs mt-2">
              {Math.round(progress)}%
            </p>

            <div className="absolute -inset-4 opacity-30">
              <div className="absolute top-0 left-1/2 w-px h-8 bg-linear-to-b from-primary to-transparent animate-pulse delay-300"></div>
              <div className="absolute bottom-0 right-1/3 w-px h-6 bg-linear-to-t from-secondary to-transparent animate-pulse delay-700"></div>
              <div className="absolute top-1/2 left-0 h-px w-6 bg-linear-to-r from-primary to-transparent animate-pulse delay-500"></div>
              <div className="absolute top-1/3 right-0 h-px w-8 bg-linear-to-l from-secondary to-transparent animate-pulse delay-900"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Structure (behind overlay, prevents CLS) */}
        <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-40 bg-background/80">
          <div className="container py-4">
            <nav className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-muted/20 rounded-full animate-pulse"></div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="w-12 h-4 bg-muted/20 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-muted/20 rounded animate-pulse"></div>
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <section className="container py-24 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="space-y-4 mb-8">
                <div className="h-12 bg-muted/20 rounded animate-pulse max-w-2xl mx-auto"></div>
                <div className="h-8 bg-muted/20 rounded animate-pulse max-w-xl mx-auto"></div>
              </div>
              <div className="space-y-3 mb-12">
                <div className="h-6 bg-muted/20 rounded animate-pulse max-w-3xl mx-auto"></div>
                <div className="h-6 bg-muted/20 rounded animate-pulse max-w-2xl mx-auto"></div>
              </div>
            </div>
          </section>

          <section className="container py-12" style={{ minHeight: '400px' }}>
            <div className="text-center mb-12">
              <div className="h-8 bg-muted/20 rounded animate-pulse max-w-md mx-auto mb-4"></div>
              <div className="h-4 bg-muted/20 rounded animate-pulse max-w-lg mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-muted/20 rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted/20 rounded"></div>
                    <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-muted/20 rounded-full w-16"></div>
                    <div className="h-6 bg-muted/20 rounded-full w-20"></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="h-4 bg-muted/20 rounded w-20"></div>
                    <div className="h-4 bg-muted/20 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-border/50 mt-20">
          <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="h-4 bg-muted/20 rounded w-48 animate-pulse"></div>
              <div className="flex gap-6">
                <div className="h-4 bg-muted/20 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-muted/20 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-muted/20 rounded w-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      {children}
    </div>
  );
}