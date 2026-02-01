
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Trophy } from 'lucide-react';
import { Habit } from '../types';

interface FocusTimerProps {
  habit: Habit;
  onComplete: (habitId: string, durationInSeconds: number) => void;
  onClose: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ habit, onComplete, onClose }) => {
  const [seconds, setSeconds] = useState(habit.targetDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout for browser-based TypeScript environments
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, seconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((habit.targetDuration * 60 - seconds) / (habit.targetDuration * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-[60] p-4 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-md p-10 text-center shadow-2xl relative overflow-hidden">
        {/* Progress Background */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-indigo-500/10 transition-all duration-1000" 
          style={{ height: `${progress}%` }}
        />

        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-slate-500 mb-2 uppercase tracking-widest">{habit.name}</h2>
          <div className="text-7xl font-black text-slate-800 tabular-nums my-8">
            {formatTime(seconds)}
          </div>

          {isFinished ? (
            <div className="space-y-6 animate-bounce">
              <div className="flex justify-center">
                <Trophy className="w-16 h-16 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Session Complete!</h3>
              <button
                onClick={() => onComplete(habit.id, habit.targetDuration * 60)}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
              >
                Claim Progress
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-6">
              <button
                onClick={() => setSeconds(habit.targetDuration * 60)}
                className="p-4 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setIsActive(!isActive)}
                className={`p-6 rounded-full shadow-xl transition-all transform active:scale-90 ${
                  isActive ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
              </button>
              
              <div className="w-14" /> {/* Spacer to center the play button */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
