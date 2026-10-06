import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, MapPin, Eye } from 'lucide-react';
import {
  QUEST_LOCATIONS,
  QUEST_SPOTTED,
  generateQuestLore,
  generateQuestReward,
  generateExp,
} from '@/types';

type Props = {
  open: boolean;
  minutes: number;
  onClose: () => void;
  onClaim: (exp: number, location: string, spotted: string, lore: string) => void;
};

export function QuestModal({ open, minutes, onClose, onClaim }: Props) {
  const [step, setStep] = useState<'select' | 'loading' | 'result'>('select');
  const [location, setLocation] = useState('');
  const [spotted, setSpotted] = useState('');
  const [lore, setLore] = useState('');
  const [reward, setReward] = useState('');
  const [exp, setExp] = useState(0);

  const handleClaim = () => {
    if (!location || !spotted) return;
    setStep('loading');
    setTimeout(() => {
      const earnedExp = generateExp(minutes);
      const loreText = generateQuestLore(location, spotted, earnedExp);
      const rewardText = generateQuestReward();
      setExp(earnedExp);
      setLore(loreText);
      setReward(rewardText);
      setStep('result');
    }, 2200);
  };

  const handleClose = () => {
    if (step === 'result') {
      onClaim(exp, location, spotted, lore);
    }
    setStep('select');
    setLocation('');
    setSpotted('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={step !== 'loading' ? handleClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-grass-panel border-2 border-emerald-500/40 rounded-sm pixel-corner max-w-md w-full p-6 pixel-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                >
                  <div className="text-center">
                    <h3 className="text-sm font-pixel text-emerald-300 text-glow mb-1">
                      Quest Report
                    </h3>
                    <p className="text-xs font-mono text-gray-400">
                      Session complete: {minutes} min outside
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-[10px] font-pixel text-emerald-400/70 uppercase flex items-center gap-1.5 mb-2">
                      <MapPin className="w-3 h-3" /> Where did you wander?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {QUEST_LOCATIONS.map((loc) => (
                        <motion.button
                          key={loc}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setLocation(loc)}
                          className={`p-2.5 rounded-sm border-2 font-mono text-xs transition-all ${
                            location === loc
                              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                              : 'border-gray-700/50 bg-grass-darker/50 text-gray-400 hover:border-emerald-500/40'
                          }`}
                        >
                          {loc}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Spotted */}
                  <div>
                    <label className="text-[10px] font-pixel text-emerald-400/70 uppercase flex items-center gap-1.5 mb-2">
                      <Eye className="w-3 h-3" /> What did you spot?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {QUEST_SPOTTED.map((spot) => (
                        <motion.button
                          key={spot}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSpotted(spot)}
                          className={`p-2.5 rounded-sm border-2 font-mono text-xs transition-all ${
                            spotted === spot
                              ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                              : 'border-gray-700/50 bg-grass-darker/50 text-gray-400 hover:border-amber-500/40'
                          }`}
                        >
                          {spot}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={location && spotted ? { scale: 1.02 } : {}}
                    whileTap={location && spotted ? { scale: 0.98 } : {}}
                    onClick={handleClaim}
                    disabled={!location || !spotted}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 border-2 border-emerald-400 rounded-sm font-pixel text-xs text-white text-glow disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-500 hover:to-emerald-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Claim Rewards
                  </motion.button>
                </motion.div>
              )}

              {step === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6 py-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
                  />
                  <p className="text-xs font-pixel text-emerald-300 text-glow text-center">
                    Analyzing local outdoor scan...
                  </p>
                  <LoadingBar />
                </motion.div>
              )}

              {step === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500/50 rounded-sm flex items-center justify-center"
                  >
                    <Trophy className="w-8 h-8 text-amber-400" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <p className="text-lg font-pixel text-amber-400 text-glow-gold">
                      +{exp} EXP!
                    </p>
                    <p className="text-xs font-mono text-emerald-300 mt-1">{reward}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-grass-darker/60 border border-emerald-500/20 rounded-sm p-4 w-full"
                  >
                    <p className="text-[10px] font-pixel text-emerald-400/60 uppercase mb-2">
                      Quest Log
                    </p>
                    <p className="text-xs font-mono text-gray-300 leading-relaxed">
                      {lore}
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 border-2 border-emerald-400 rounded-sm font-pixel text-xs text-white hover:from-emerald-500 hover:to-emerald-400 transition-all"
                  >
                    Continue Adventure
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingBar() {
  return (
    <div className="w-48 h-3 bg-grass-darker border-2 border-emerald-500/30 rounded-sm overflow-hidden">
      <motion.div
        className="h-full bg-emerald-500"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'linear' }}
      />
    </div>
  );
}
