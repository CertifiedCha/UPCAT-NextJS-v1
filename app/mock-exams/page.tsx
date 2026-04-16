"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/lib/store";
import { subjects } from "@/lib/data/content";

interface MockExam {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  questions: number;
  subjects: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "Full UPCAT";
  xp: number;
  icon: string;
}

const mockExams: MockExam[] = [
  {
    id: "mock-diagnostic",
    title: "Diagnostic Test",
    description: "Find out where you stand across all subjects. No pressure — just a baseline.",
    duration: 30,
    questions: 40,
    subjects: ["math", "science", "language", "reading"],
    difficulty: "Easy",
    xp: 300,
    icon: "radar",
  },
  {
    id: "mock-math-focused",
    title: "Math Sprint",
    description: "Intense math-only session covering arithmetic, algebra, and geometry.",
    duration: 25,
    questions: 30,
    subjects: ["math"],
    difficulty: "Medium",
    xp: 250,
    icon: "calculate",
  },
  {
    id: "mock-sci-lang",
    title: "Science & Language",
    description: "Combined Science and Language Proficiency exam — two birds, one stone.",
    duration: 35,
    questions: 40,
    subjects: ["science", "language"],
    difficulty: "Medium",
    xp: 350,
    icon: "science",
  },
  {
    id: "mock-full-1",
    title: "Full Mock Exam I",
    description: "Simulated UPCAT covering all four subjects in proper test conditions.",
    duration: 90,
    questions: 120,
    subjects: ["math", "science", "language", "reading"],
    difficulty: "Full UPCAT",
    xp: 1000,
    icon: "assignment",
  },
  {
    id: "mock-full-2",
    title: "Full Mock Exam II",
    description: "Second full simulation with a different question set. Harder.",
    duration: 90,
    questions: 120,
    subjects: ["math", "science", "language", "reading"],
    difficulty: "Full UPCAT",
    xp: 1200,
    icon: "assignment_late",
  },
  {
    id: "mock-reading-deep",
    title: "Reading Comprehension Deep Dive",
    description: "Long passages, inference questions, and critical analysis. The real challenge.",
    duration: 40,
    questions: 35,
    subjects: ["reading"],
    difficulty: "Hard",
    xp: 400,
    icon: "menu_book",
  },
];

const difficultyColors: Record<string, { color: string; bg: string }> = {
  Easy: { color: "#066c4e", bg: "rgba(6,108,78,0.1)" },
  Medium: { color: "#BA7517", bg: "rgba(186,117,23,0.1)" },
  Hard: { color: "#D85A30", bg: "rgba(216,90,48,0.1)" },
  "Full UPCAT": { color: "#570005", bg: "rgba(87,0,5,0.1)" },
};

type ExamState = "list" | "confirm" | "running" | "result";

export default function MockExamsPage() {
  const router = useRouter();
  const { progress, completeQuiz, recordStudySession } = useStore();
  const [examState, setExamState] = useState<ExamState>("list");
  const [selectedExam, setSelectedExam] = useState<MockExam | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [score] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");

  const filteredExams = filterDifficulty === "All"
    ? mockExams
    : mockExams.filter((e) => e.difficulty === filterDifficulty);

  const startExam = (exam: MockExam) => {
    setSelectedExam(exam);
    setExamState("confirm");
  };

  const confirmStart = () => {
    if (!selectedExam) return;
    setTimeLeft(selectedExam.duration * 60);
    setTimerActive(true);
    setExamState("running");
    // For demo: immediately go to result after 3s (real impl = full quiz engine)
    setTimeout(() => {
      setTimerActive(false);
      setExamState("result");
    }, 3000);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const getSubjectChips = (subjectIds: string[]) =>
    subjectIds.map((id) => subjects.find((s) => s.id === id)).filter(Boolean);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ─── LIST ─── */}
          {examState === "list" && (
            <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Header */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Mock Exams</p>
                <h1 className="font-display text-4xl font-black text-on-surface leading-tight mb-3">
                  Test yourself.<br />
                  <span className="text-on-surface-variant font-light italic">For real this time.</span>
                </h1>
                <p className="text-on-surface-variant text-sm max-w-xl">
                  Timed exams that simulate actual UPCAT conditions. Build exam stamina, identify weak spots, and track improvement over time.
                </p>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Exams Taken", value: progress.completedQuizzes.filter(id => id.startsWith("mock")).length, icon: "assignment_turned_in", color: "#066c4e" },
                  { label: "Avg Score", value: (() => {
                    const mockScores = Object.entries(progress.quizScores).filter(([id]) => id.startsWith("mock")).map(([, score]) => score);
                    return mockScores.length ? `${Math.round(mockScores.reduce((a, b) => a + b, 0) / mockScores.length)}%` : "—";
                  })(), icon: "analytics", color: "#7F77DD" },
                  { label: "Best Score", value: (() => {
                    const mockScores = Object.entries(progress.quizScores).filter(([id]) => id.startsWith("mock")).map(([, score]) => score);
                    return mockScores.length ? `${Math.max(...mockScores)}%` : "—";
                  })(), icon: "emoji_events", color: "#BA7517" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 shadow-ambient">
                    <span className="material-symbols-outlined filled text-2xl" style={{ color: stat.color }}>{stat.icon}</span>
                    <p className="text-2xl font-black text-on-surface mt-1">{stat.value}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Filter chips */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                {["All", "Easy", "Medium", "Hard", "Full UPCAT"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDifficulty(d)}
                    className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      filterDifficulty === d
                        ? "editorial-gradient text-white"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Exam cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredExams.map((exam, i) => {
                  const diff = difficultyColors[exam.difficulty];
                  const isTaken = progress.completedQuizzes.includes(exam.id);
                  const examScore = progress.quizScores[exam.id];
                  const subjectChips = getSubjectChips(exam.subjects);

                  return (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-ambient card-hover overflow-hidden"
                    >
                      {/* Difficulty strip */}
                      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${diff.color}99, ${diff.color}22)` }} />

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 editorial-gradient rounded-2xl flex items-center justify-center">
                              <span className="material-symbols-outlined filled text-white text-2xl">{exam.icon}</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-on-surface text-base">{exam.title}</h3>
                              <span
                                className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                style={{ color: diff.color, backgroundColor: diff.bg }}
                              >
                                {exam.difficulty}
                              </span>
                            </div>
                          </div>
                          {isTaken && examScore !== undefined && (
                            <div className="text-right">
                              <p className={`text-lg font-black ${examScore >= 80 ? "text-secondary" : examScore >= 60 ? "text-subject-reading" : "text-error"}`}>
                                {examScore}%
                              </p>
                              <p className="text-[10px] text-on-surface-variant">best score</p>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{exam.description}</p>

                        {/* Subject chips */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {subjectChips.map((s) => s && (
                            <span
                              key={s.id}
                              className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                              style={{ color: s.color, backgroundColor: s.bgColor }}
                            >
                              {s.title.split(" ")[0]}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 mb-5 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>timer</span>
                            <span className="text-xs font-medium text-on-surface-variant">{exam.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>quiz</span>
                            <span className="text-xs font-medium text-on-surface-variant">{exam.questions} questions</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined filled text-secondary" style={{ fontSize: 14 }}>bolt</span>
                            <span className="text-xs font-bold text-secondary">+{exam.xp} XP</span>
                          </div>
                        </div>

                        <button
                          onClick={() => startExam(exam)}
                          className="w-full editorial-gradient text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-ambient-md"
                        >
                          {isTaken ? (
                            <>
                              <span className="material-symbols-outlined text-lg">replay</span>
                              Retake Exam
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-lg filled">play_arrow</span>
                              Start Exam
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── CONFIRM ─── */}
          {examState === "confirm" && selectedExam && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-20 h-20 editorial-gradient rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined filled text-white text-4xl">{selectedExam.icon}</span>
              </div>
              <h2 className="font-display text-3xl font-black text-on-surface mb-2">{selectedExam.title}</h2>
              <p className="text-on-surface-variant text-sm mb-8">{selectedExam.description}</p>

              <div className="bg-surface-container rounded-2xl p-6 mb-8 text-left space-y-4">
                {[
                  { icon: "timer", label: "Duration", value: `${selectedExam.duration} minutes` },
                  { icon: "quiz", label: "Questions", value: `${selectedExam.questions} questions` },
                  { icon: "bolt", label: "XP Reward", value: `Up to +${selectedExam.xp} XP` },
                  { icon: "warning", label: "Note", value: "Once started, the timer cannot be paused." },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="material-symbols-outlined filled text-on-surface-variant text-xl">{row.icon}</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{row.label}</p>
                      <p className="text-sm font-semibold text-on-surface">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setExamState("list")}
                  className="flex-1 bg-surface-container border border-outline-variant/20 text-on-surface font-bold py-3.5 rounded-2xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStart}
                  className="flex-1 editorial-gradient text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-ambient-md"
                >
                  <span className="material-symbols-outlined text-lg filled">play_arrow</span>
                  Begin Now
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── RUNNING (demo loading screen) ─── */}
          {examState === "running" && selectedExam && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-24 h-24 editorial-gradient rounded-3xl flex items-center justify-center mb-6 animate-pulse">
                <span className="material-symbols-outlined filled text-white text-4xl">assignment</span>
              </div>
              <h2 className="font-display text-2xl font-black text-on-surface mb-2">Exam in Progress</h2>
              <p className="text-on-surface-variant text-sm mb-6">Full exam engine coming in Phase 3</p>
              <div className="font-mono text-4xl font-black text-primary-container">
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-on-surface-variant mt-2">Redirecting to results demo...</p>
            </motion.div>
          )}

          {/* ─── RESULT ─── */}
          {examState === "result" && selectedExam && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-lg mx-auto"
            >
              <div className="text-6xl mb-4">📋</div>
              <h2 className="font-display text-3xl font-black text-on-surface mb-2">
                {selectedExam.title} — Complete
              </h2>
              <p className="text-on-surface-variant text-sm mb-8">
                Full mock exam scoring will be live in Phase 3.<br />
                For now, head to individual quizzes to practice.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { setExamState("list"); setSelectedExam(null); }}
                  className="bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient card-hover"
                >
                  <span className="material-symbols-outlined text-lg">list</span>
                  All Exams
                </button>
                <button
                  onClick={() => router.push("/materials")}
                  className="editorial-gradient text-white font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient-md"
                >
                  <span className="material-symbols-outlined text-lg">library_books</span>
                  Study Materials
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
