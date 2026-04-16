"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Subject = "math" | "science" | "language" | "reading";

export interface UserProfile {
  name: string;
  targetDate: string; // UPCAT exam date
  weakSubjects: Subject[];
  strongSubjects: Subject[];
  dailyGoalMinutes: number;
  onboardingComplete: boolean;
  avatar: string; // emoji avatar
}

export interface Progress {
  completedLessons: string[]; // lesson IDs
  completedQuizzes: string[]; // quiz IDs
  quizScores: Record<string, number>; // quizId -> score %
  lessonProgress: Record<string, number>; // lessonId -> 0-100
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string; // ISO date string
  studyDates: string[]; // all dates studied
}

export interface SessionData {
  totalMinutes: number;
  subjectMinutes: Record<Subject, number>;
  dailyMinutes: Record<string, number>; // date -> minutes
}

export interface AppState {
  profile: UserProfile | null;
  progress: Progress;
  streak: StreakData;
  session: SessionData;
  xp: number;
  level: number;

  // Actions
  setProfile: (profile: UserProfile) => void;
  completeLesson: (lessonId: string) => void;
  completeQuiz: (quizId: string, score: number) => void;
  setLessonProgress: (lessonId: string, progress: number) => void;
  addXP: (amount: number) => void;
  recordStudySession: (minutes: number, subject: Subject) => void;
  updateStreak: () => void;
  resetAll: () => void;
}

const XP_PER_LEVEL = 500;

const defaultProgress: Progress = {
  completedLessons: [],
  completedQuizzes: [],
  quizScores: {},
  lessonProgress: {},
};

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: "",
  studyDates: [],
};

const defaultSession: SessionData = {
  totalMinutes: 0,
  subjectMinutes: { math: 0, science: 0, language: 0, reading: 0 },
  dailyMinutes: {},
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      progress: defaultProgress,
      streak: defaultStreak,
      session: defaultSession,
      xp: 0,
      level: 1,

      setProfile: (profile) => set({ profile }),

      completeLesson: (lessonId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedLessons: state.progress.completedLessons.includes(lessonId)
              ? state.progress.completedLessons
              : [...state.progress.completedLessons, lessonId],
            lessonProgress: { ...state.progress.lessonProgress, [lessonId]: 100 },
          },
        })),

      completeQuiz: (quizId, score) => {
        set((state) => ({
          progress: {
            ...state.progress,
            completedQuizzes: state.progress.completedQuizzes.includes(quizId)
              ? state.progress.completedQuizzes
              : [...state.progress.completedQuizzes, quizId],
            quizScores: { ...state.progress.quizScores, [quizId]: score },
          },
        }));
        get().addXP(Math.round(score * 2));
      },

      setLessonProgress: (lessonId, progress) =>
        set((state) => ({
          progress: {
            ...state.progress,
            lessonProgress: { ...state.progress.lessonProgress, [lessonId]: progress },
          },
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          return { xp: newXP, level: newLevel };
        }),

      recordStudySession: (minutes, subject) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => ({
          session: {
            totalMinutes: state.session.totalMinutes + minutes,
            subjectMinutes: {
              ...state.session.subjectMinutes,
              [subject]: state.session.subjectMinutes[subject] + minutes,
            },
            dailyMinutes: {
              ...state.session.dailyMinutes,
              [today]: (state.session.dailyMinutes[today] || 0) + minutes,
            },
          },
        }));
        get().updateStreak();
        get().addXP(minutes * 2);
      },

      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const { lastStudyDate, currentStreak, longestStreak, studyDates } = state.streak;
          if (lastStudyDate === today) return state;

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().split("T")[0];

          const newStreak = lastStudyDate === yStr ? currentStreak + 1 : 1;
          return {
            streak: {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, longestStreak),
              lastStudyDate: today,
              studyDates: studyDates.includes(today) ? studyDates : [...studyDates, today],
            },
          };
        });
      },

      resetAll: () =>
        set({
          profile: null,
          progress: defaultProgress,
          streak: defaultStreak,
          session: defaultSession,
          xp: 0,
          level: 1,
        }),
    }),
    {
      name: "upcat-hub-store",
    }
  )
);
