import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import type { PlayerStats } from '@/types';
import { GARDEN_STAGES, getGardenStage } from '@/types';

type Props = {
  stats: PlayerStats;
  onClick: () => void;
};

const STATUS_MESSAGES = [
  'Your plant hums with contentment.',
  'A gentle breeze rustles its leaves.',
  'It glows softly in the ambient light.',
  'Your garden companion is thriving!',
  'Pixel petals shimmer with gratitude.',
  'The roots grow deeper with each session.',
  'You feel a calm energy radiating outward.',
  'A tiny pixel bird lands nearby, then flies off.',
];

type FloatingParticle = {
  id: number;
  x: number;
  y: number;
  type: 'heart' | 'sparkle';
};

export function PixelGarden({ stats, onClick }: Props) {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const stageIndex = getGardenStage(stats.totalHours);
  const stage = GARDEN_STAGES[stageIndex];
  const nextStage = GARDEN_STAGES[stageIndex + 1];

  const handleClick = useCallback(() => {
    onClick();

    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 80,
      y: -60 - Math.random() * 60,
      type: Math.random() > 0.5 ? 'heart' as const : 'sparkle' as const,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 2000);

    const msg = STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  }, [onClick]);

  return (
    <div className="bg-grass-panel/80 backdrop-blur-sm pixel-border pixel-corner p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-pixel text-emerald-300 text-glow uppercase">
          Pixel Garden
        </h3>
        <span className="text-xs font-mono text-gray-500">{stage.name}</span>
      </div>

      {/* Garden Display */}
      <div
        className="relative flex flex-col items-center justify-center bg-gradient-to-b from-sky-950/20 via-grass-darker to-emerald-950/30 border-2 border-emerald-500/20 rounded-sm h-48 cursor-pointer overflow-hidden select-none"
        onClick={handleClick}
      >
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-emerald-900/30 border-t-2 border-emerald-700/30" />

        {/* Plant */}
        <motion.div
          className="relative z-10 mb-4 cursor-pointer"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-6xl block drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            {stage.emoji}
          </span>
        </motion.div>

        {/* Floating particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute z-20 pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.2 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              {p.type === 'heart' ? (
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-400" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Status message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 bg-grass-panel/90 border border-emerald-500/30 rounded-sm px-3 py-1.5 max-w-[90%]"
            >
              <p className="text-[10px] font-mono text-emerald-300 text-center whitespace-nowrap">
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint */}
        <p className="absolute bottom-2 text-[8px] font-pixel text-gray-600 uppercase">
          Click to interact
        </p>
      </div>

      {/* Stage info */}
      <div className="mt-3">
        <p className="text-xs font-mono text-gray-400 text-center mb-2">{stage.description}</p>
        {nextStage && (
          <div>
            <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-1">
              <span>Next: {nextStage.name}</span>
              <span>{stats.totalHours.toFixed(1)}/{nextStage.minHours}h</span>
            </div>
            <div className="h-2 bg-grass-darker border border-emerald-500/20 rounded-sm overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (stats.totalHours / nextStage.minHours) * 100)}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
        {!nextStage && (
          <p className="text-[10px] font-pixel text-amber-400/70 text-center text-glow-gold">
            MAX EVOLUTION
          </p>
        )}
      </div>
    </div>
  );
}
