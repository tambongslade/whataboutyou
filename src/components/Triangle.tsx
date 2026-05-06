import React from 'react';

type TriangleColor = 'yellow' | 'red';
type TriangleShape = 'right' | 'left' | 'pointy' | 'asym';

interface TriangleProps {
  className: string;
  color?: TriangleColor;
  shape?: TriangleShape;
  rotate?: number;
  opacity?: number;
}

const SHAPES: Record<TriangleShape, string> = {
  right: 'polygon(0 0, 100% 50%, 0 100%)',
  left: 'polygon(100% 0, 0 50%, 100% 100%)',
  pointy: 'polygon(0 50%, 100% 0, 100% 100%)',
  asym: 'polygon(0 0, 100% 40%, 20% 100%)',
};

const Triangle: React.FC<TriangleProps> = ({
  className,
  color = 'yellow',
  shape = 'right',
  rotate = 0,
  opacity = 0.85,
}) => (
  <div
    aria-hidden="true"
    className={`absolute pointer-events-none select-none ${className} ${
      color === 'red' ? 'bg-red-600' : 'bg-yellow-400'
    }`}
    style={{
      clipPath: SHAPES[shape],
      transform: `rotate(${rotate}deg)`,
      opacity,
    }}
  />
);

export default Triangle;
