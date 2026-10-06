import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import type { QuestEntry } from '@/types';

type Props = {
  history: QuestEntry[];
};

export function QuestHistory({ history }: Props) {
  return (
    <div className="bg-grass-panel/80 backdrop-blur-sm pixel-border pixel-corner p-5">
      <div className="flex items-center gap-2 mb-4">
        <ScrollText className="w-5 h-5 text-emerald-400" />
        <h3 className="text-xs font-pixel text-emerald-300 text-glow uppercase">
          Quest History
        </h3>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <p className="text-3xl opacity-30">📜</p>
          <p className="text-xs font-mono text-gray-500 text-center">
            No adventures yet. Start your first session!
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-grass-darker/50 border border-emerald-500/15 rounded-sm p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-pixel text-emerald-400/70 uppercase">
                  {entry.location} · {entry.spotted}
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  +{entry.exp} EXP
                </span>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                {entry.lore}
              </p>
              <p className="text-[9px] font-mono text-gray-600 mt-1">
                {entry.duration} min · {new Date(entry.date).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
