import React from 'react';

const DecorativeTriangles: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
    <div
      className="absolute top-[8%] left-[6%] w-10 h-14 bg-yellow-400 opacity-90"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(-18deg)' }}
    />
    <div
      className="absolute bottom-[18%] left-[3%] w-8 h-12 bg-yellow-400 opacity-80"
      style={{ clipPath: 'polygon(0 0, 100% 40%, 20% 100%)', transform: 'rotate(25deg)' }}
    />
    <div
      className="absolute top-[55%] right-[14%] w-10 h-14 bg-yellow-400 opacity-80"
      style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transform: 'rotate(12deg)' }}
    />
    <div
      className="absolute top-[18%] right-[4%] w-16 h-10 bg-red-600 opacity-90"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(-10deg)' }}
    />
    <div
      className="absolute top-[42%] left-[2%] w-14 h-9 bg-red-600 opacity-85"
      style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transform: 'rotate(8deg)' }}
    />
    <div
      className="absolute bottom-[8%] right-[6%] w-12 h-8 bg-red-600 opacity-80"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(20deg)' }}
    />
    <div
      className="absolute top-[30%] right-[18%] w-10 h-14 bg-yellow-400 opacity-85"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(15deg)' }}
    />
    <div
      className="absolute bottom-[28%] left-[18%] w-8 h-12 bg-yellow-400 opacity-80"
      style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transform: 'rotate(-22deg)' }}
    />
  </div>
);

export default DecorativeTriangles;
