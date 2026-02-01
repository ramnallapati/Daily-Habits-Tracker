
import React from 'react';
import { Heart, Briefcase, Book, Sparkles, Box } from 'lucide-react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.HEALTH]: <Heart className="w-5 h-5 text-red-500" />,
  [Category.WORK]: <Briefcase className="w-5 h-5 text-blue-500" />,
  [Category.LEARNING]: <Book className="w-5 h-5 text-green-500" />,
  [Category.MINDFULNESS]: <Sparkles className="w-5 h-5 text-purple-500" />,
  [Category.OTHER]: <Box className="w-5 h-5 text-gray-500" />,
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.HEALTH]: 'bg-red-50 border-red-200',
  [Category.WORK]: 'bg-blue-50 border-blue-200',
  [Category.LEARNING]: 'bg-green-50 border-green-200',
  [Category.MINDFULNESS]: 'bg-purple-50 border-purple-200',
  [Category.OTHER]: 'bg-gray-50 border-gray-200',
};
