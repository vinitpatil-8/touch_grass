import { motion } from 'framer-motion';
import { Flame, Clock, Star, Zap } from 'lucide-react';
import type { PlayerStats } from '@/types';
import { getLevelInfo } from '@/types';

type Props = {
  stats: PlayerStats;
};

export function PlayerDashboard({ stats }: Props) {
  const level = getLevelInfo(stats.totalExp);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-grass-panel/80 backdrop-blur-sm pixel-border pixel-corner p-5 md:p-6"
    >
      <div className="flex flex-col gap-4">
        {/* Level + Title */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center rounded-sm">
              <Star className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-pixel text-emerald-400/70 uppercase tracking-wider">Player</p>
              <h2 className="text-sm md:text-base font-pixel text-emerald-300 text-glow">
                Lv.{level.level}
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{level.title}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <StatChip icon={<Flame className="w-4 h-4" />} label="Streak" value={`${stats.streakDays}d`} color="text-orange-400" />
            <StatChip icon={<Clock className="w-4 h-4" />} label="Hours" value={stats.totalHours.toFixed(1)} color="text-sky-400" />
            <StatChip icon={<Zap className="w-4 h-4" />} label="Total EXP" value={stats.totalExp.toLocaleString()} color="text-gold-400" />
          </div>
        </div>

        {/* EXP Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-pixel text-emerald-400/60 uppercase">EXP</span>
            <span className="text-xs font-mono text-gray-400">
              {level.currentLevelExp} / {level.nextLevelExp}
            </span>
          </div>
          <div className="h-4 bg-grass-darker border-2 border-emerald-500/30 rounded-sm overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 relative"
              initial={{ width: 0 }}
              animate={{ width: `${level.progress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.2) 6px, rgba(0,0,0,0.2) 8px)',
                }}
              />
              <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                backgroundSize: '200% 100%',
              }} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatChip({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-grass-panel2 border border-emerald-500/20 px-3 py-1.5 rounded-sm">
      <span className={color}>{icon}</span>
      <div className="flex flex-col leading-none">
        <span className="text-[8px] font-pixel text-gray-500 uppercase">{label}</span>
        <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
      </div>
    </div>
  );
}
