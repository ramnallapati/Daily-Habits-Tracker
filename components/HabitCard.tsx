
import React from 'react';
import { CheckCircle, Circle, Timer, Settings, Lock, Bell } from 'lucide-react';
import { Habit, HabitLog } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

interface HabitCardProps {
  habit: Habit;
  log?: HabitLog;
  history: HabitLog[];
  onToggleStatus: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onOpenTimer: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  log, 
  history,
  onToggleStatus, 
  onToggleComplete, 
  onOpenTimer, 
  onEdit 
}) => {
  const isCompleted = log?.completed || false;
  const canModify = isCompleted;
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const streakDots = last7Days.map(date => {
    const dayLog = history.find(h => h.date === date);
    return {
      date,
      status: dayLog?.completed ? 'done' : date === new Date().toISOString().split('T')[0] ? 'pending' : 'missed'
    };
  });

  return (
    <div className={`p-5 rounded-3xl border-2 transition-all duration-500 flex flex-col h-full ${isCompleted ? 'bg-indigo-50/40 border-indigo-100' : 'bg-white border-slate-100'} shadow-sm hover:shadow-xl hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl shadow-sm ${CATEGORY_COLORS[habit.category]}`}>
            {CATEGORY_ICONS[habit.category]}
          </div>
          <div>
            <h3 className={`font-bold text-slate-800 transition-all ${isCompleted ? 'text-indigo-600' : ''}`}>{habit.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{habit.category}</p>
              {habit.targetTime && (
                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-black">
                  <Bell className="w-2.5 h-2.5" />
                  {habit.targetTime}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {habit.description || 'Consistency is key.'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-6 px-1">
        {streakDots.map((dot, idx) => (
          <div 
            key={dot.date} 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${
              dot.status === 'done' ? 'bg-indigo-500 scale-110 shadow-sm shadow-indigo-200' : 
              dot.status === 'pending' ? 'bg-slate-100 border-2 border-slate-200' : 
              'bg-slate-100 opacity-40'
            }`} 
            title={dot.date}
          />
        ))}
        <span className="text-[9px] font-black text-slate-300 ml-1 uppercase tracking-tighter">Streak</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => habit.isActive && onToggleComplete(habit.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 transition-all duration-300 font-black text-sm ${
            !habit.isActive 
              ? 'bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed' 
              : isCompleted 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 active:scale-95'
          }`}
          disabled={!habit.isActive}
        >
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {isCompleted ? 'Done' : 'Tick'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenTimer(habit)}
            disabled={!habit.isActive || isCompleted}
            className={`p-3.5 rounded-2xl border-2 transition-all ${
              !habit.isActive || isCompleted 
                ? 'bg-slate-50 text-slate-200 border-slate-50 cursor-not-allowed' 
                : 'bg-white text-indigo-600 border-slate-200 hover:border-indigo-500 active:scale-90'
            }`}
          >
            <Timer className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onEdit(habit)}
            disabled={!habit.isActive || !canModify}
            className={`p-3.5 rounded-2xl border-2 transition-all relative ${
              !habit.isActive || !canModify
                ? 'bg-slate-50 text-slate-300 border-slate-50 cursor-not-allowed' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-500 active:scale-90'
            }`}
          >
            {canModify ? <Settings className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
