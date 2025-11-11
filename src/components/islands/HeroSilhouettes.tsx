import React from 'react';
import { Logo } from './Logo';

export const HeroSilhouettes: React.FC = () => {
  return (
    <>
      <div className="absolute top-0 -right-32 -translate-y-1/2 opacity-60 grayscale brightness-0 z-49">
        <Logo className="w-64 h-64" />
      </div>
    </>
  );
};

export default HeroSilhouettes;