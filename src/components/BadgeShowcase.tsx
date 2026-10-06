import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { PlayerStats, Badge } from '@/types';
import { BADGES } from '@/types';

type Props = {
  stats: PlayerStats;
};

export function BadgeShowcase({ stats }: Props) {
  return (
    <div className="bg-grass-panel/80 backdrop-blur-sm pixel-border pixel-corner p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-pixel text-emerald-300 text-glow uppercase">Achievements</h3>
        <span className="text-xs font-mono text-gray-500">
          {stats.unlockedBadges.length}/{BADGES.length}
        </span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {BADGES.map((badge: Badge) => {
          const unlocked = stats.unlockedBadges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              whileHover={unlocked ? { scale: 1.08, rotate: -2 } : { scale: 1.02 }}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-sm border-2 transition-all cursor-default ${
                unlocked
                  ? 'border-emerald-500/50 bg-emerald-500/10 animate-glow-pulse'
                  : 'border-gray-700/50 bg-grass-darker/60'
              }`}
            >
              <div className={`text-2xl ${unlocked ? '' : 'grayscale opacity-30'}`}>
                {unlocked ? badge.icon : <Lock className="w-5 h-5 text-gray-600" />}
              </div>
              <span
                className={`text-[7px] font-pixel text-center leading-tight ${
                  unlocked ? 'text-emerald-300' : 'text-gray-600'
                }`}
              >
                {badge.name}
              </span>
              <span className="text-[9px] font-mono text-center leading-tight text-gray-500 hidden md:block">
                {badge.description}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
