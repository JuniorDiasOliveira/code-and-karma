import React from 'react';

interface LogoProps {
  className?: string;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-16 h-16", 
  animate = true 
}) => {
  const classes = [
    className,
    animate && "animate-spin-slow"
  ].filter(Boolean).join(" ");

  return (
    <img
      src="/logo.png"
      alt="Code & Karma Logo"
      className={classes}
    />
  );
};

export default Logo;