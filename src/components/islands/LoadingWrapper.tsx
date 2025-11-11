import React, { useState, useEffect } from 'react';
import { PageLoader } from './PageLoader.tsx';

interface LoadingWrapperProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

export function LoadingWrapper({ children, minLoadTime = 3000 }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadComplete = () => {
    console.log('Load complete called'); // Debug log
    setIsLoading(false);
    // Delay to show smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 200);
  };

  useEffect(() => {
    console.log('LoadingWrapper mounted'); // Debug log
    // Force completion after minLoadTime + buffer to ensure it doesn't get stuck
    const forceComplete = setTimeout(() => {
      console.log('Force completing loader'); // Debug log
      handleLoadComplete();
    }, minLoadTime + 1000);

    return () => {
      clearTimeout(forceComplete);
    };
  }, [minLoadTime]);

  if (isLoading) {
    return <PageLoader onLoadComplete={handleLoadComplete} minLoadTime={minLoadTime} />;
  }

  return (
    <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
}