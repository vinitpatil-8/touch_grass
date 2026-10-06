export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: PlayerStats) => boolean;
};

export type PlayerStats = {
  totalExp: number;
  streakDays: number;
  totalHours: number;
  sessionsCompleted: number;
  lastSessionDate: string | null;
  unlockedBadges: string[];
  gardenStage: number;
  gardenClicks: number;
  questHistory: QuestEntry[];
};

export type QuestEntry = {
  id: string;
  date: string;
  location: string;
  spotted: string;
  lore: string;
  exp: number;
  duration: number;
};

export type SessionDuration = {
  label: string;
  minutes: number;
};

export type GardenStage = {
  name: string;
  emoji: string;
  minHours: number;
  description: string;
};

export const LEVEL_TITLES = [
  'Seed Sprouter',
  'Dewdrop Novice',
  'Lawn Wanderer',
  'Meadow Rover',
  'Trail Seeker',
  'Forest Forager',
  'Sunlight Sage',
  'No-Wifi Legend',
  'Cosmic Gardener',
  'Grass Touched Ascended',
];

export const SESSION_DURATIONS: SessionDuration[] = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '1 hr', minutes: 60 },
  { label: '2 hr', minutes: 120 },
];

export const GARDEN_STAGES: GardenStage[] = [
  { name: 'Seedling', emoji: '🌱', minHours: 0, description: 'A tiny seed with big dreams.' },
  { name: 'Sprout', emoji: '🌿', minHours: 2, description: 'Reaching for the sun.' },
  { name: 'Pixel Flower', emoji: '🌸', minHours: 6, description: 'Blooming in vibrant colors.' },
  { name: 'Glowing Ancient Tree', emoji: '🌳', minHours: 15, description: 'A wise old sentinel of the meadow.' },
];

export const BADGES: Badge[] = [
  {
    id: 'first-lawn',
    name: 'First Lawn',
    description: 'Complete your first session',
    icon: '🌳',
    condition: (s) => s.sessionsCompleted >= 1,
  },
  {
    id: 'trail-blazer',
    name: 'Trail Blazer',
    description: 'Complete 5 sessions',
    icon: '🧭',
    condition: (s) => s.sessionsCompleted >= 5,
  },
  {
    id: 'sunlight-addict',
    name: 'Sunlight Addict',
    description: 'Accumulate 5+ hours outside',
    icon: '☀️',
    condition: (s) => s.totalHours >= 5,
  },
  {
    id: 'no-wifi-legend',
    name: 'No-Wifi Legend',
    description: 'Reach a 7-day streak',
    icon: '📡',
    condition: (s) => s.streakDays >= 7,
  },
  {
    id: 'explore-master',
    name: 'Explore Master',
    description: 'Complete 10 sessions',
    icon: '🗺️',
    condition: (s) => s.sessionsCompleted >= 10,
  },
  {
    id: 'grass-touched',
    name: 'Grass Touched',
    description: 'Accumulate 20+ hours outside',
    icon: '🌱',
    condition: (s) => s.totalHours >= 20,
  },
];

export const QUEST_LOCATIONS = ['Park', 'Garden', 'Woods', 'Balcony'];

export const QUEST_SPOTTED = ['Birds', 'Sun', 'Flowers', 'Cloud'];

export const QUEST_LORE_TEMPLATES = [
  'You wandered into the {loc} and discovered a hidden {spot} trail. A mysterious breeze whispered ancient secrets of the meadow.',
  'While exploring the {loc}, you encountered a {spot} phenomenon that infused your spirit with +{exp} EXP of pure nature energy.',
  'The {loc} revealed its secrets today. You documented rare {spot} patterns and earned the title of Meadow Cartographer.',
  'A gentle {spot} encounter at the {loc} blessed your journey. The pixel grass grows stronger with your presence.',
  'You stumbled upon a secret glade in the {loc}. The {spot} there told tales of old — your XP increased by {exp}.',
  'Deep in the {loc}, you found a {spot} shrine. Touching the grass around it granted you mystical growth.',
  'The {loc} was alive with {spot} today. You felt your connection to the earth deepen, gaining {exp} EXP.',
  'A golden {spot} guided your path through the {loc}. You return wiser, calmer, and richer in experience.',
];

export const QUEST_REWARDS = [
  'You found a Golden Clover!',
  'You discovered a Hidden Fountain!',
  'You befriended a Pixel Butterfly!',
  'You uncovered a Sunken Stone!',
  'You collected Rare Dew Drops!',
  'You spotted a Rainbow Leaf!',
  'You found a Whispering Twig!',
  'You earned a Meadow Crystal!',
];

export function expForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function getLevelInfo(totalExp: number) {
  let level = 1;
  let remaining = totalExp;
  while (remaining >= expForLevel(level)) {
    remaining -= expForLevel(level);
    level++;
  }
  const needed = expForLevel(level);
  const progress = Math.min(remaining / needed, 1);
  return {
    level,
    currentLevelExp: remaining,
    nextLevelExp: needed,
    progress,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
  };
}

export function getGardenStage(totalHours: number): number {
  let stage = 0;
  for (let i = 0; i < GARDEN_STAGES.length; i++) {
    if (totalHours >= GARDEN_STAGES[i].minHours) stage = i;
  }
  return stage;
}

export function generateQuestLore(location: string, spotted: string, exp: number): string {
  const template = QUEST_LORE_TEMPLATES[Math.floor(Math.random() * QUEST_LORE_TEMPLATES.length)];
  return template
    .replace('{loc}', location.toLowerCase())
    .replace('{spot}', spotted.toLowerCase())
    .replace('{exp}', String(exp));
}

export function generateQuestReward(): string {
  return QUEST_REWARDS[Math.floor(Math.random() * QUEST_REWARDS.length)];
}

export function generateExp(minutes: number): number {
  const base = minutes * 5;
  const bonus = Math.floor(Math.random() * 50) + 20;
  return base + bonus;
}

export const DEFAULT_STATS: PlayerStats = {
  totalExp: 0,
  streakDays: 0,
  totalHours: 0,
  sessionsCompleted: 0,
  lastSessionDate: null,
  unlockedBadges: [],
  gardenStage: 0,
  gardenClicks: 0,
  questHistory: [],
};
