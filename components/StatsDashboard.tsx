
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { Habit, HabitLog, Category } from '../types';
import { TrendingUp, Award, Calendar, History, Trophy, BarChart3 } from 'lucide-react';

interface StatsProps {
  habits: Habit[];
  logs: HabitLog[];
}

type StatView = 'daily' | 'weekly' | 'monthly';

const StatsDashboard: React.FC<StatsProps> = ({ habits, logs }) => {
  const [view, setView] = useState<StatView>('daily');

  // Helper to get week number
  const getWeek = (date: Date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  };

  const chartData = useMemo(() => {
    if (view === 'daily') {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      return last7Days.map(date => ({
        name: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
        completed: logs.filter(l => l.date === date && l.completed).length,
        time: Math.round(logs.filter(l => l.date === date).reduce((acc, curr) => acc + curr.timeSpent, 0) / 60)
      }));
    }

    if (view === 'weekly') {
      // Last 8 weeks
      const data = [];
      const now = new Date();
      for (let i = 7; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - (i * 7));
        const weekNum = getWeek(d);
        const year = d.getFullYear();
        
        // Filter logs in this week
        const weekLogs = logs.filter(l => {
          const logDate = new Date(l.date);
          return getWeek(logDate) === weekNum && logDate.getFullYear() === year;
        });

        data.push({
          name: `W${weekNum}`,
          completed: weekLogs.filter(l => l.completed).length,
          time: Math.round(weekLogs.reduce((acc, curr) => acc + curr.timeSpent, 0) / 60)
        });
      }
      return data;
    }

    if (view === 'monthly') {
      // Last 6 months
      const data = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthLabel = d.toLocaleDateString(undefined, { month: 'short' });
        const month = d.getMonth();
        const year = d.getFullYear();

        const monthLogs = logs.filter(l => {
          const logDate = new Date(l.date);
          return logDate.getMonth() === month && logDate.getFullYear() === year;
        });

        data.push({
          name: monthLabel,
          completed: monthLogs.filter(l => l.completed).length,
          time: Math.round(monthLogs.reduce((acc, curr) => acc + curr.timeSpent, 0) / 60)
        });
      }
      return data;
    }

    return [];
  }, [logs, view]);

  const categoryData = useMemo(() => {
    return Object.values(Category).map(cat => ({
      name: cat,
      value: habits.filter(h => h.category === cat).length
    })).filter(c => c.value > 0);
  }, [habits]);

  // Comprehensive Stats Calculation
  const totals = useMemo(() => {
    const totalCompletions = logs.filter(l => l.completed).length;
    const totalMinutes = Math.round(logs.reduce((acc, curr) => acc + curr.timeSpent, 0) / 60);
    const totalHours = Math.round(totalMinutes / 60);
    
    // Streak logic
    let currentStreak = 0;
    const sortedDates = [...new Set(logs.filter(l => l.completed).map(l => l.date))].sort().reverse();
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (sortedDates.length > 0) {
      // Check if streak is still alive (today or yesterday completed)
      if (sortedDates[0] === todayStr || sortedDates[0] === yesterdayStr) {
        let checkDate = new Date(sortedDates[0]);
        for (let i = 0; i < sortedDates.length; i++) {
          const expectedStr = checkDate.toISOString().split('T')[0];
          if (sortedDates.includes(expectedStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    return { totalCompletions, totalHours, currentStreak, totalMinutes };
  }, [logs]);

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Award className="w-6 h-6" /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Total Done</p>
            <h4 className="text-2xl font-black text-slate-800">{totals.totalCompletions}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-pink-50 rounded-2xl text-pink-600"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Focus Time</p>
            <h4 className="text-2xl font-black text-slate-800">{totals.totalHours} hrs</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><Trophy className="w-6 h-6" /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Best Streak</p>
            <h4 className="text-2xl font-black text-slate-800">{totals.currentStreak} days</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Calendar className="w-6 h-6" /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Active Habits</p>
            <h4 className="text-2xl font-black text-slate-800">{habits.length}</h4>
          </div>
        </div>
      </div>

      {/* Main Trends Chart */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-800">Growth Trends</h3>
            <p className="text-sm text-slate-400">Track your consistency over time</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setView(t)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  view === t 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="#6366f1" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="time" 
                stroke="#ec4899" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                fill="transparent"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center gap-6 mt-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-xs font-bold text-slate-500 uppercase">Completions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-400" />
            <span className="text-xs font-bold text-slate-500 uppercase">Focus (min)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><BarChart3 className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold text-slate-800">Distribution</h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <History className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12" />
          <div className="relative z-10">
            <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">Self Improvement</h3>
            <h2 className="text-3xl font-black mb-6">Yearly Projection</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-slate-400 text-sm">Est. Annual Completions</span>
                <span className="text-2xl font-black">{totals.totalCompletions > 0 ? Math.round((totals.totalCompletions / (logs.length || 1)) * 365) : 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-slate-400 text-sm">Est. Learning Hours</span>
                <span className="text-2xl font-black">{totals.totalHours > 0 ? Math.round((totals.totalHours / (logs.length || 1)) * 365) : 0}h</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                "It does not matter how slowly you go as long as you do not stop." 
                Track every day to build a masterpiece of a year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
