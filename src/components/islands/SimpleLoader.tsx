import { useState, useEffect } from 'react';

interface SimpleLoaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

export function SimpleLoader({ children, minLoadTime = 3000 }: SimpleLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    console.log('SimpleLoader mounted');
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 8 + 2;
      });
    }, 50);

    const textUpdates = [
      { delay: 800, text: 'Loading components...' },
      { delay: 1600, text: 'Activating effects...' },
      { delay: 2400, text: 'Almost ready...' }
    ];

    const textTimeouts = textUpdates.map(({ delay, text }) =>
      setTimeout(() => setLoadingText(text), delay)
    );

    // Complete loading
    const completeTimeout = setTimeout(() => {
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
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
              Karma & Code
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
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  );
}