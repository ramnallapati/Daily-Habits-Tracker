
import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Lightbulb, RefreshCw } from 'lucide-react';
import { getHabitInsights } from '../services/gemini';
import { Habit, HabitLog } from '../types';

interface AICoachProps {
  habits: Habit[];
  logs: HabitLog[];
}

const AICoach: React.FC<AICoachProps> = ({ habits, logs }) => {
  const [insights, setInsights] = useState<{
    summary: string;
    focusHabit: string;
    suggestion: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (habits.length === 0) return;
    setLoading(true);
    const data = await getHabitInsights(habits, logs);
    if (data) setInsights(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (habits.length === 0) return (
    <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 p-8 rounded-3xl text-center">
      <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-indigo-900">Add habits to get AI coaching</h3>
      <p className="text-indigo-600">Gemini will analyze your patterns and give you professional advice.</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Brain className="w-32 h-32" />
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-200">Gemini AI Coach</span>
          </div>
          <h2 className="text-3xl font-black">Daily Insight</h2>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-white/20 rounded w-3/4" />
          <div className="h-6 bg-white/20 rounded w-full" />
          <div className="h-6 bg-white/20 rounded w-5/6" />
        </div>
      ) : insights ? (
        <div className="space-y-6">
          <p className="text-xl leading-relaxed font-medium">
            "{insights.summary}"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-indigo-200">
                <Brain className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Priority Focus</span>
              </div>
              <p className="font-semibold">{insights.focusHabit}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-indigo-200">
                <Lightbulb className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Try This</span>
              </div>
              <p className="font-semibold">{insights.suggestion}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-indigo-100">Click refresh to generate your daily coaching session.</p>
      )}
    </div>
  );
};

export default AICoach;
