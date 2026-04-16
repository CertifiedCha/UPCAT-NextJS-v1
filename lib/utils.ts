import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getLevelProgress(xp: number): { level: number; progress: number; xpInLevel: number; xpForNext: number } {
  const XP_PER_LEVEL = 500;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const progress = (xpInLevel / XP_PER_LEVEL) * 100;
  return { level, progress, xpInLevel, xpForNext: XP_PER_LEVEL };
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    math: "#7F77DD",
    science: "#1D9E75",
    language: "#D85A30",
    reading: "#BA7517",
  };
  return colors[subject] || "#888780";
}

export function getSubjectBg(subject: string): string {
  const colors: Record<string, string> = {
    math: "rgba(127,119,221,0.1)",
    science: "rgba(29,158,117,0.1)",
    language: "rgba(216,90,48,0.1)",
    reading: "rgba(186,117,23,0.1)",
  };
  return colors[subject] || "rgba(136,135,128,0.1)";
}

export function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    math: "Mathematics",
    science: "Science",
    language: "Language Proficiency",
    reading: "Reading Comprehension",
  };
  return labels[subject] || subject;
}

export function getSubjectIcon(subject: string): string {
  const icons: Record<string, string> = {
    math: "calculate",
    science: "science",
    language: "translate",
    reading: "menu_book",
  };
  return icons[subject] || "school";
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Generate last N days as ISO strings for heatmap
export function getLastNDays(n: number): string[] {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}
