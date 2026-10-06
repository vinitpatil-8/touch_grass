import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Clock, Leaf } from 'lucide-react';
import { SESSION_DURATIONS } from '@/types';

type Props = {
  onComplete: (minutes: number) => void;
};

export function SessionTimer({ onComplete }: Props) {
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [customMinutes, setCustomMinutes] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = selectedMinutes * 60;

  useEffect(() => {
    if (isActive && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);
            onComplete(selectedMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, remaining, onComplete, selectedMinutes]);

  const handleStart = useCallback(() => {
    const mins = selectedMinutes;
    setRemaining(mins * 60);
    setIsActive(true);
  }, [selectedMinutes]);

  const handleStop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setRemaining(0);
  }, []);

  const handleClaim = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsed = totalSeconds - remaining;
    const minutesElapsed = Math.max(1, Math.round(elapsed / 60));
    setIsActive(false);
    setRemaining(0);
    onComplete(minutesElapsed);
  }, [remaining, totalSeconds, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = isActive ? remaining / totalSeconds : 0;

  if (isActive) {
    return (
      <FocusMode
        minutes={minutes}
        seconds={seconds}
        progress={progress}
        onClaim={handleClaim}
        onCancel={handleStop}
      />
    );
  }

  return (
    <div className="bg-grass-panel/80 backdrop-blur-sm pixel-border pixel-corner p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="w-5 h-5 text-emerald-400" />
        <h3 className="text-xs font-pixel text-emerald-300 text-glow uppercase">
          Unplug Session
        </h3>
      </div>

      <p className="text-xs text-gray-400 font-mono mb-4 leading-relaxed">
        Choose your outdoor target. Put the phone away. Go touch grass.
      </p>

      {/* Duration Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        {SESSION_DURATIONS.map((dur) => (
          <motion.button
            key={dur.minutes}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedMinutes(dur.minutes)}
            className={`p-3 rounded-sm border-2 transition-all font-mono text-sm ${
              selectedMinutes === dur.minutes
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 text-glow'
                : 'border-gray-700/50 bg-grass-darker/50 text-gray-400 hover:border-emerald-500/40'
            }`}
          >
            {dur.label}
          </motion.button>
        ))}
      </div>

      {/* Custom */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-2 flex-1">
          <Clock className="w-4 h-4 text-gray-500" />
          <input
            type="number"
            min={1}
            max={480}
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Custom minutes"
            className="flex-1 bg-grass-darker/50 border-2 border-gray-700/50 rounded-sm px-3 py-2 text-sm font-mono text-gray-300 focus:border-emerald-500/50 focus:outline-none placeholder:text-gray-600"
          />
        </div>
        <button
          onClick={() => {
            const val = parseInt(customMinutes);
            if (val > 0 && val <= 480) setSelectedMinutes(val);
          }}
          className="px-4 py-2 border-2 border-emerald-500/30 rounded-sm text-xs font-mono text-emerald-400 hover:bg-emerald-500/10 transition-colors"
        >
          Set
        </button>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStart}
        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 border-2 border-emerald-400 rounded-sm font-pixel text-sm text-white text-glow pixel-shadow hover:from-emerald-500 hover:to-emerald-400 transition-all flex items-center justify-center gap-2"
      >
        <Play className="w-5 h-5" fill="currentColor" />
        🌱 Start Touch Grass Session
      </motion.button>
    </div>
  );
}

function FocusMode({
  minutes,
  seconds,
  progress,
  onClaim,
  onCancel,
}: {
  minutes: number;
  seconds: number;
  progress: number;
  onClaim: () => void;
  onCancel: () => void;
}) {
  const circumference = 2 * Math.PI * 80;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-grass-darker/95 backdrop-blur-md flex flex-col items-center justify-center px-4"
    >
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-grass-darker to-grass-darker" />
      <div className="absolute inset-0 scanlines opacity-20" />

      {/* Floating leaves */}
      <FocusLeaves />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <p className="text-[10px] font-pixel text-emerald-500/60 uppercase tracking-widest">
          Focus Mode Active
        </p>

        {/* Timer Ring */}
        <div className="relative">
          <svg width="220" height="220" className="-rotate-90">
            <circle
              cx="110"
              cy="110"
              r="80"
              fill="none"
              stroke="rgba(16, 185, 129, 0.1)"
              strokeWidth="6"
            />
            <motion.circle
              cx="110"
              cy="110"
              r="80"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference * (1 - progress) }}
              transition={{ ease: 'linear' }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-pixel text-emerald-300 text-glow">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono text-gray-500 mt-2">remaining</span>
          </div>
        </div>

        {/* Soundwave animation */}
        <Soundwave />

        {/* Claim button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClaim}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 border-2 border-amber-300 rounded-sm font-pixel text-sm text-grass-darker pixel-shadow hover:from-amber-400 hover:to-amber-300 transition-all"
        >
          I'm Back! Claim EXP
        </motion.button>

        <button
          onClick={onCancel}
          className="text-xs font-mono text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Square className="w-3 h-3" fill="currentColor" /> Cancel session
        </button>
      </motion.div>
    </motion.div>
  );
}

function Soundwave() {
  const bars = Array.from({ length: 12 });
  return (
    <div className="flex items-center justify-center gap-1.5 h-12">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-emerald-400/60 rounded-full"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.08,
            ease: 'easeInOut',
          }}
          style={{ height: 32, transformOrigin: 'center' }}
        />
      ))}
    </div>
  );
}

function FocusLeaves() {
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 6,
    drift: (Math.random() - 0.5) * 60,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((l) => (
        <motion.div
          key={l.id}
          className="absolute text-emerald-500/30"
          style={{ left: `${l.x}%`, bottom: -20 }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: [0, -(window.innerHeight + 40)],
            x: [0, l.drift, 0],
            opacity: [0, 0.5, 0.5, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Leaf className="w-5 h-5" />
        </motion.div>
      ))}
    </div>
  );
}
