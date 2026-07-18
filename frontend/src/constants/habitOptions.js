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
  { value: "Fitness", icon: Dumbbell, color: "text-accent-emerald" },
  { value: "Study", icon: BookOpen, color: "text-accent-blue" },
  { value: "Reading", icon: Book, color: "text-accent-violet" },
  { value: "Meditation", icon: Brain, color: "text-accent-violet" },
  { value: "Coding", icon: Code2, color: "text-accent-blue" },
  { value: "Diet", icon: Utensils, color: "text-accent-emerald" },
  { value: "Water Intake", icon: Droplet, color: "text-accent-blue" },
  { value: "Sleep", icon: Moon, color: "text-accent-violet" },
  { value: "Finance", icon: Wallet, color: "text-accent-emerald" },
  { value: "Custom", icon: Sparkles, color: "text-ink-muted" },
];

// Must match backend enum in models/Habit.js exactly
export const PRIORITIES = ["Low", "Medium", "High"];
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const getCategoryMeta = (value) =>
  CATEGORIES.find((c) => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
