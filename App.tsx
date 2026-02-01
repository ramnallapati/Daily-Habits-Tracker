
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutGrid, BrainCircuit, Sparkles, Calendar as CalendarIcon, Target, TrendingUp, Zap } from 'lucide-react';
import HabitCard from './components/HabitCard';
import HabitForm from './components/HabitForm';
import FocusTimer from './components/FocusTimer';
import StatsDashboard from './components/StatsDashboard';
import AICoach from './components/AICoach';
import { Habit, HabitLog, Category } from './types';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('habit_tracker_habits');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [logs, setLogs] = useState<HabitLog[]>(() => {
    try {
      const saved = localStorage.getItem('habit_tracker_logs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [activeTab, setActiveTab] = useState<'daily' | 'stats' | 'coach'>('daily');
  const [editingHabit, setEditingHabit] = useState<Habit | null | undefined>(undefined);
  const [timerHabit, setTimerHabit] = useState<Habit | null>(null);

  useEffect(() => {
    localStorage.setItem('habit_tracker_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habit_tracker_logs', JSON.stringify(logs));
  }, [logs]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const displayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const handleSaveHabit = (data: Partial<Habit>) => {
    if (editingHabit) {
      setHabits(prev => prev.map(h => h.id === editingHabit.id ? { ...h, ...data } : h));
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: data.name!,
        description: data.description!,
        category: data.category!,
        targetDuration: data.targetDuration!,
        targetTime: data.targetTime,
        createdAt: Date.now(),
        isActive: true,
      };
      setHabits(prev => [...prev, newHabit]);
    }
    setEditingHabit(undefined);
  };

  const toggleHabitStatus = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, isActive: !h.isActive } : h));
  };

  const toggleComplete = (habitId: string) => {
    const existingIndex = logs.findIndex(l => l.habitId === habitId && l.date === todayStr);
    
    if (existingIndex > -1) {
      const newLogs = [...logs];
      newLogs[existingIndex].completed = !newLogs[existingIndex].completed;
      setLogs(newLogs);
    } else {
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habitId,
        date: todayStr,
        completed: true,
        timeSpent: 0
      };
      setLogs(prev => [...prev, newLog]);
    }
  };

  const handleTimerComplete = (habitId: string, seconds: number) => {
    const existingIndex = logs.findIndex(l => l.habitId === habitId && l.date === todayStr);
    const newLogData = {
      completed: true,
      timeSpent: seconds
    };

    if (existingIndex > -1) {
      const newLogs = [...logs];
      newLogs[existingIndex].timeSpent += seconds;
      newLogs[existingIndex].completed = true;
      setLogs(newLogs);
    } else {
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habitId,
        date: todayStr,
        completed: true,
        timeSpent: seconds
      };
      setLogs(prev => [...prev, newLog]);
    }
    setTimerHabit(null);
  };

  const dailyCompletionRate = useMemo(() => {
    if (habits.length === 0) return 0;
    const completedToday = logs.filter(l => l.date === todayStr && l.completed).length;
    return Math.round((completedToday / habits.length) * 100);
  }, [logs, habits, todayStr]);

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#FAFBFF]">
      {/* Dynamic Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[50] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter">HabitFlow<span className="text-indigo-600">AI</span></h1>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{displayDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Daily Target</span>
                <span className="text-sm font-black text-indigo-600">{dailyCompletionRate}% Complete</span>
             </div>
             <button
              onClick={() => setEditingHabit(null)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              New Goal
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-10 bg-white p-2 rounded-3xl w-fit shadow-sm border border-slate-100">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all text-xs uppercase tracking-widest ${activeTab === 'daily' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Daily
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all text-xs uppercase tracking-widest ${activeTab === 'stats' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <TrendingUp className="w-4 h-4" />
            Trends
          </button>
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all text-xs uppercase tracking-widest ${activeTab === 'coach' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Sparkles className="w-4 h-4" />
            Coach
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500">
          {activeTab === 'daily' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Today's Rituals</h2>
                  <p className="text-sm text-slate-400 font-medium">Master your day, master your life.</p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                  <Zap className="w-4 h-4 text-indigo-600 fill-current" />
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Strict Mode Active</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {habits.length === 0 ? (
                  <div className="col-span-full py-32 text-center bg-white border-4 border-dashed border-slate-100 rounded-[3rem]">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Target className="w-12 h-12 text-slate-200" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">No Active Rituals</h2>
                    <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm font-medium">Your journey to greatness starts with a single habit. Launch one now.</p>
                    <button
                      onClick={() => setEditingHabit(null)}
                      className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-2xl active:scale-95 uppercase text-xs tracking-widest"
                    >
                      <Plus className="w-5 h-5 stroke-[3px]" />
                      Start First Habit
                    </button>
                  </div>
                ) : (
                  habits.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      log={logs.find(l => l.habitId === habit.id && l.date === todayStr)}
                      history={logs.filter(l => l.habitId === habit.id)}
                      onToggleStatus={toggleHabitStatus}
                      onToggleComplete={toggleComplete}
                      onOpenTimer={setTimerHabit}
                      onEdit={setEditingHabit}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && <StatsDashboard habits={habits} logs={logs} />}
          {activeTab === 'coach' && <AICoach habits={habits} logs={logs} />}
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-8 right-8 md:hidden z-[60]">
        <button
          onClick={() => setEditingHabit(null)}
          className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90"
        >
          <Plus className="w-8 h-8 stroke-[3px]" />
        </button>
      </div>

      {/* Modals */}
      {editingHabit !== undefined && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSaveHabit}
          onClose={() => setEditingHabit(undefined)}
        />
      )}

      {timerHabit && (
        <FocusTimer
          habit={timerHabit}
          onComplete={handleTimerComplete}
          onClose={() => setTimerHabit(null)}
        />
      )}
    </div>
  );
};

export default App;
