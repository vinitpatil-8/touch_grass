import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_STATS, type PlayerStats } from '@/types';

const STORAGE_KEY = 'touch-grass-rpg-save';

export function usePlayerStats() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<PlayerStats>;
        return { ...DEFAULT_STATS, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  const addSession = useCallback(
    (exp: number, minutes: number, quest: { location: string; spotted: string; lore: string }) => {
      setStats((prev) => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        let streak = prev.streakDays;
        if (prev.lastSessionDate === today) {
          // already counted today
        } else if (prev.lastSessionDate === yesterday) {
          streak += 1;
        } else {
          streak = 1;
        }

        const newTotalHours = prev.totalHours + minutes / 60;
        const stage = Math.max(prev.gardenStage, getStageIndex(newTotalHours));

        const entry = {
          id: `${Date.now()}`,
          date: new Date().toISOString(),
          location: quest.location,
          spotted: quest.spotted,
          lore: quest.lore,
          exp,
          duration: minutes,
        };

        const newStats: PlayerStats = {
          ...prev,
          totalExp: prev.totalExp + exp,
          streakDays: streak,
          totalHours: newTotalHours,
          sessionsCompleted: prev.sessionsCompleted + 1,
          lastSessionDate: today,
          gardenStage: stage,
          questHistory: [entry, ...prev.questHistory].slice(0, 20),
        };

        return newStats;
      });
    },
    []
  );

  const clickGarden = useCallback(() => {
    setStats((prev) => ({ ...prev, gardenClicks: prev.gardenClicks + 1 }));
  }, []);

  const resetGame = useCallback(() => {
    setStats(DEFAULT_STATS);
  }, []);

  return { stats, addSession, clickGarden, resetGame };
}

function getStageIndex(hours: number): number {
  const thresholds = [0, 2, 6, 15];
  let stage = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (hours >= thresholds[i]) stage = i;
  }
  return stage;
}
