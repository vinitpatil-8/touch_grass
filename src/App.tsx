import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Leaf, RotateCcw, Github } from 'lucide-react';
import { usePlayerStats } from '@/usePlayerStats';
import { BADGES, getGardenStage } from '@/types';
import { PixelParticles } from '@/components/PixelParticles';
import { PlayerDashboard } from '@/components/PlayerDashboard';
import { BadgeShowcase } from '@/components/BadgeShowcase';
import { SessionTimer } from '@/components/SessionTimer';
import { QuestModal } from '@/components/QuestModal';
import { PixelGarden } from '@/components/PixelGarden';
import { QuestHistory } from '@/components/QuestHistory';

function App() {
  const { stats, addSession, clickGarden, resetGame } = usePlayerStats();
  const [questOpen, setQuestOpen] = useState(false);
  const [pendingMinutes, setPendingMinutes] = useState(0);

  // Check for newly unlocked badges
  const newlyUnlocked = useMemo(() => {
    const unlocked: string[] = [];
    for (const badge of BADGES) {
      if (!stats.unlockedBadges.includes(badge.id) && badge.condition(stats)) {
        unlocked.push(badge.id);
      }
    }
    return unlocked;
  }, [stats]);

  // Update unlocked badges in localStorage via stats effect
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      const updated = [...stats.unlockedBadges, ...newlyUnlocked];
      const key = 'touch-grass-rpg-save';
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.unlockedBadges = updated;
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }
  }, [newlyUnlocked, stats.unlockedBadges]);

  const handleSessionComplete = (minutes: number) => {
    setPendingMinutes(minutes);
    setQuestOpen(true);
  };

  const handleQuestClaim = (exp: number, location: string, spotted: string, lore: string) => {
    addSession(exp, pendingMinutes, { location, spotted, lore });
  };

  const gardenStageIndex = getGardenStage(stats.totalHours);

  return (
    <div className="min-h-screen bg-grass-dark text-gray-200 relative overflow-x-hidden">
      {/* Background particles */}
      <PixelParticles leafMode={gardenStageIndex >= 2} />

      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-grass-dark via-grass-darker to-grass-dark pointer-events-none" />
      <div className="fixed inset-0 scanlines opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 md:mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-11 h-11 bg-emerald-500/15 border-2 border-emerald-500/40 rounded-sm flex items-center justify-center"
            >
              <Leaf className="w-6 h-6 text-emerald-400" />
            </motion.div>
            <div>
              <h1 className="text-sm md:text-lg font-pixel text-emerald-300 text-glow leading-tight">
                TOUCH GRASS
              </h1>
              <p className="text-[10px] md:text-xs font-pixel text-gold-400 text-glow-gold leading-tight">
                RPG
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) {
                resetGame();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-red-400 transition-colors border border-gray-700/50 hover:border-red-500/30 rounded-sm px-3 py-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {/* Left Column */}
          <div className="flex flex-col gap-4 md:gap-5">
            <PlayerDashboard stats={stats} />
            <SessionTimer onComplete={handleSessionComplete} />
            <PixelGarden stats={stats} onClick={clickGarden} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 md:gap-5">
            <BadgeShowcase stats={stats} />
            <QuestHistory history={stats.questHistory} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs font-mono text-gray-600">
            Touch Grass RPG · Go outside · Touch grass · Earn EXP
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-gray-700">
            <Github className="w-4 h-4" />
            <span className="text-[10px] font-mono">Made with pixels &amp; sunshine</span>
          </div>
        </footer>
      </div>

      {/* Quest Modal */}
      <QuestModal
        open={questOpen}
        minutes={pendingMinutes}
        onClose={() => setQuestOpen(false)}
        onClaim={handleQuestClaim}
      />
    </div>
  );
}

export default App;
