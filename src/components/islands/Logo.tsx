import React from 'react';

interface LogoProps {
  className?: string;
  animate?: boolean;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-16 h-16", 
  animate = true,
  loading = 'lazy',
  priority = false
}) => {
  const classes = [
    className,
    animate && "animate-spin-slow"
  ].filter(Boolean).join(" ");

  const loadingStrategy = priority ? 'eager' : loading;

  return (
    <img
      src="/logo.webp"
      alt="Code & Karma Logo"
      className={classes}
      loading={loadingStrategy}
      decoding="async"
      width="256"
      height="256"
      style={{
        aspectRatio: '1/1',
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo;