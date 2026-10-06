import { useMemo } from 'react';
import { motion } from 'framer-motion';

type Props = {
  leafMode?: boolean;
};

export function PixelParticles({ leafMode = false }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: leafMode ? 20 : 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        size: 6 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 80,
      })),
    [leafMode]
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, bottom: -20 }}
          initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: [0, -(window.innerHeight + 40)],
            x: [0, p.drift, 0],
            opacity: [0, 0.6, 0.6, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {leafMode ? (
            <LeafPixel size={p.size} />
          ) : (
            <PixelSquare size={p.size} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function PixelSquare({ size }: { size: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="bg-emerald-500/20 rounded-sm"
    />
  );
}

function LeafPixel({ size }: { size: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="text-emerald-400/50"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
        <rect x="6" y="2" width="4" height="2" />
        <rect x="4" y="4" width="8" height="2" />
        <rect x="3" y="6" width="10" height="2" />
        <rect x="2" y="8" width="12" height="2" />
        <rect x="3" y="10" width="10" height="2" />
        <rect x="5" y="12" width="6" height="1" />
        <rect x="7" y="13" width="2" height="2" />
      </svg>
    </div>
  );
}
