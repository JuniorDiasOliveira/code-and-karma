import React from 'react';
import { Logo } from './Logo';

export const HeroSilhouettes: React.FC = () => {
  return (
    <>
      <div className="absolute top-0 -translate-y-1/2 opacity-60 grayscale brightness-0 z-49 right-0 md:-right-32 overflow-hidden">
        <Logo className="w-32 h-32 md:w-64 md:h-64" />
      </div>
    </>
  );
};

export default HeroSilhouettes;