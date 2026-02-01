
import React, { useState } from 'react';
import { X, Clock, Zap } from 'lucide-react';
import { Habit, Category } from '../types';

interface HabitFormProps {
  habit?: Habit | null;
  onSave: (habit: Partial<Habit>) => void;
  onClose: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ habit, onSave, onClose }) => {
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [category, setCategory] = useState<Category>(habit?.category || Category.HEALTH);
  const [targetDuration, setTargetDuration] = useState(habit?.targetDuration || 30);
  const [targetTime, setTargetTime] = useState(habit?.targetTime || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      category,
      targetDuration: Number(targetDuration),
      targetTime: targetTime || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800">{habit ? 'Refine Ritual' : 'New Daily Ritual'}</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Design your lifestyle</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Habit Name</label>
            <input
              type="text"
              required
              autoFocus
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
              placeholder="e.g., Early Morning Wakeup"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                <input
                  type="time"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
              <select
                className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Daily Focus (Minutes)</label>
            <input
              type="number"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
              value={targetDuration}
              onChange={(e) => setTargetDuration(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mission Details</label>
            <textarea
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all resize-none font-medium text-slate-600 text-sm"
              placeholder="Why is this important to you?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-indigo-200 mt-4 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Zap className="w-5 h-5 fill-current" />
            {habit ? 'Commit Changes' : 'Launch Ritual'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
