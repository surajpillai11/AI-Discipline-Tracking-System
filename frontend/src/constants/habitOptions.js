import {
  Dumbbell,
  BookOpen,
  Book,
  Brain,
  Code2,
  Utensils,
  Droplet,
  Moon,
  Wallet,
  Sparkles,
} from "lucide-react";

// Must match backend CATEGORIES in models/Habit.js exactly
export const CATEGORIES = [
  { value: "Fitness", icon: Dumbbell, color: "text-emerald-500" },
  { value: "Study", icon: BookOpen, color: "text-blue-500" },
  { value: "Reading", icon: Book, color: "text-violet-500" },
  { value: "Meditation", icon: Brain, color: "text-violet-300" },
  { value: "Coding", icon: Code2, color: "text-blue-700" },
  { value: "Diet", icon: Utensils, color: "text-emerald-300" },
  { value: "Water Intake", icon: Droplet, color: "text-sky-400" },
  { value: "Sleep", icon: Moon, color: "text-violet-700" },
  { value: "Finance", icon: Wallet, color: "text-emerald-700" },
  { value: "Custom", icon: Sparkles, color: "text-slate-400" },
];

// Must match backend enum in models/Habit.js exactly
export const PRIORITIES = ["Low", "Medium", "High"];
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const getCategoryMeta = (value) =>
  CATEGORIES.find((c) => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
