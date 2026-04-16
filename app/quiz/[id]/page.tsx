"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AppLayout from "@/components/layout/AppLayout";
import { quizzes, subjects } from "@/lib/data/content";
import { useStore } from "@/lib/store";
import type { Subject } from "@/lib/store";
import { getSubjectColor, getSubjectBg } from "@/lib/utils";

type QuizState = "intro" | "question" | "result" | "review";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const quiz = quizzes.find((q) => q.id === quizId);
  const { completeQuiz, recordStudySession } = useStore();

  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz?.duration ? quiz.duration * 60 : null);
  const [startTime] = useState(Date.now());

  const subject = subjects.find((s) => s.id === quiz?.subject);
  const color = subject?.color || getSubjectColor(quiz?.subject || "");
  const bg = subject?.bgColor || getSubjectBg(quiz?.subject || "");

  // Timer
  useEffect(() => {
    if (quizState !== "question" || timeLeft === null) return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => (p !== null ? p - 1 : null)), 1000);
    return () => clearInterval(t);
  });

  const handleFinish = useCallback(() => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      const ans = answers[i];
      if (!ans) return;
      if (q.type === "matching" || q.type === "ordering") {
        const correctArr = q.correct as string[];
        const ansArr = ans as string[];
        if (JSON.stringify(ansArr) === JSON.stringify(correctArr)) correct++;
      } else {
        if (ans === q.correct) correct++;
      }
    });
    const score = Math.round((correct / quiz.questions.length) * 100);
    const minutes = Math.round((Date.now() - startTime) / 60000);
    completeQuiz(quizId, score);
    recordStudySession(Math.max(minutes, 1), quiz.subject as Subject);
    setQuizState("result");
  }, [quiz, answers, quizId, startTime, completeQuiz, recordStudySession]);

  const handleAnswer = (answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: answer }));
  };

  const handleNext = () => {
    if (!quiz) return;
    setShowFeedback(false);
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      handleFinish();
    }
  };

  if (!quiz) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Quiz not found.</p>
        </div>
      </AppLayout>
    );
  }

  const question = quiz.questions[currentQ];
  const currentAnswer = answers[currentQ];
  const hasAnswered = currentAnswer !== undefined && currentAnswer !== "";

  // Calculate score for result screen
  let finalScore = 0;
  let correctCount = 0;
  if (quizState === "result" || quizState === "review") {
    quiz.questions.forEach((q, i) => {
      const ans = answers[i];
      if (!ans) return;
      let isCorrect = false;
      if (q.type === "matching" || q.type === "ordering") {
        isCorrect = JSON.stringify(ans) === JSON.stringify(q.correct);
      } else {
        isCorrect = ans === q.correct;
      }
      if (isCorrect) correctCount++;
    });
    finalScore = Math.round((correctCount / quiz.questions.length) * 100);
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* ─── INTRO ─── */}
          {quizState === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: bg }}
              >
                <span className="material-symbols-outlined filled text-4xl" style={{ color }}>
                  quiz
                </span>
              </div>
              <h1 className="font-display text-3xl font-black text-on-surface mb-3">
                {quiz.title}
              </h1>
              <p className="text-on-surface-variant text-sm mb-8">
                {quiz.questions.length} questions
                {quiz.duration ? ` · ${quiz.duration} minutes` : " · Untimed"}
                {" · "}+{quiz.xp} XP on completion
              </p>

              {/* Question type chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {Array.from(new Set(quiz.questions.map((q) => q.type))).map((type) => (
                  <span
                    key={type}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                    style={{ color, backgroundColor: bg }}
                  >
                    {typeLabel(type)}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setQuizState("question")}
                className="editorial-gradient text-white font-bold px-10 py-4 rounded-2xl text-base shadow-ambient-lg flex items-center gap-2 mx-auto"
              >
                Start Quiz
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>

              <button
                onClick={() => router.back()}
                className="mt-4 text-xs text-on-surface-variant hover:text-on-surface transition-colors block mx-auto"
              >
                Go back
              </button>
            </motion.div>
          )}

          {/* ─── QUESTION ─── */}
          {quizState === "question" && (
            <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface-variant">
                    Question {currentQ + 1} of {quiz.questions.length}
                  </span>
                  <div className="flex items-center gap-3">
                    {timeLeft !== null && (
                      <span className={`text-xs font-black font-mono px-3 py-1 rounded-full ${timeLeft < 60 ? "bg-error-container text-on-error-container" : "bg-surface-container text-on-surface"}`}>
                        {formatTime(timeLeft)}
                      </span>
                    )}
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ color, backgroundColor: bg }}
                    >
                      {typeLabel(question.type)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-ambient-lg p-8 mb-6">
                <p className="text-on-surface font-bold text-lg leading-relaxed mb-8">
                  {question.question}
                </p>

                {/* Question type renderers */}
                {question.type === "mcq" && (
                  <MCQInput
                    options={question.options || []}
                    selected={currentAnswer as string}
                    correct={question.correct as string}
                    showFeedback={showFeedback}
                    onSelect={(v) => handleAnswer(v)}
                    color={color}
                  />
                )}
                {question.type === "truefalse" && (
                  <TrueFalseInput
                    selected={currentAnswer as string}
                    correct={question.correct as string}
                    showFeedback={showFeedback}
                    onSelect={(v) => handleAnswer(v)}
                    color={color}
                  />
                )}
                {question.type === "fillinblank" && (
                  <FillBlankInput
                    value={currentAnswer as string || ""}
                    correct={question.correct as string}
                    showFeedback={showFeedback}
                    onChange={(v) => handleAnswer(v)}
                    color={color}
                  />
                )}
                {question.type === "matching" && question.pairs && (
                  <MatchingInput
                    pairs={question.pairs}
                    value={currentAnswer as string[] || []}
                    correct={question.correct as string[]}
                    showFeedback={showFeedback}
                    onChange={(v) => handleAnswer(v)}
                    color={color}
                  />
                )}
                {question.type === "ordering" && question.items && (
                  <OrderingInput
                    items={question.items}
                    value={currentAnswer as string[] || [...question.items].sort(() => Math.random() - 0.5)}
                    correct={question.correct as string[]}
                    showFeedback={showFeedback}
                    onChange={(v) => handleAnswer(v)}
                    color={color}
                  />
                )}
              </div>

              {/* Feedback / explanation */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className={`rounded-2xl p-5 mb-6 border ${
                      isCorrect(question, currentAnswer)
                        ? "bg-secondary-container/30 border-secondary/20"
                        : "bg-error-container/30 border-error/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`material-symbols-outlined filled text-2xl flex-shrink-0 ${isCorrect(question, currentAnswer) ? "text-secondary" : "text-error"}`}>
                        {isCorrect(question, currentAnswer) ? "check_circle" : "cancel"}
                      </span>
                      <div>
                        <p className={`font-bold text-sm mb-1 ${isCorrect(question, currentAnswer) ? "text-secondary" : "text-error"}`}>
                          {isCorrect(question, currentAnswer) ? "Correct! 🎉" : "Not quite"}
                        </p>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  Exit
                </button>

                {!showFeedback ? (
                  <motion.button
                    whileHover={{ scale: hasAnswered ? 1.02 : 1 }}
                    whileTap={{ scale: hasAnswered ? 0.98 : 1 }}
                    onClick={() => hasAnswered && setShowFeedback(true)}
                    className={`font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center gap-2 transition-all ${
                      hasAnswered
                        ? "editorial-gradient text-white shadow-ambient-md"
                        : "bg-surface-container text-on-surface-variant cursor-not-allowed"
                    }`}
                  >
                    Check Answer
                    <span className="material-symbols-outlined text-lg">done</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="editorial-gradient text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient-md"
                  >
                    {currentQ < quiz.questions.length - 1 ? "Next Question" : "See Results"}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── RESULT ─── */}
          {quizState === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {/* Score ring */}
              <div className="relative w-36 h-36 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#f0eee5" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={finalScore >= 80 ? "#066c4e" : finalScore >= 60 ? "#BA7517" : "#ba1a1a"}
                    strokeWidth="12"
                    strokeDasharray={`${finalScore * 3.27} 327`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-on-surface">{finalScore}%</span>
                </div>
              </div>

              <div className="text-5xl mb-3">
                {finalScore >= 80 ? "🏆" : finalScore >= 60 ? "💪" : "📖"}
              </div>

              <h2 className="font-display text-3xl font-black text-on-surface mb-2">
                {finalScore >= 80 ? "Excellent!" : finalScore >= 60 ? "Good Work!" : "Keep Practicing!"}
              </h2>
              <p className="text-on-surface-variant text-sm mb-2">
                {correctCount} out of {quiz.questions.length} correct
              </p>
              <p className="text-secondary font-bold text-sm mb-10">+{Math.round(finalScore * quiz.xp / 100)} XP earned</p>

              {/* Score breakdown */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { label: "Correct", value: correctCount, color: "#066c4e", icon: "check_circle" },
                  { label: "Wrong", value: quiz.questions.length - correctCount, color: "#ba1a1a", icon: "cancel" },
                  { label: "Score", value: `${finalScore}%`, color, icon: "star" },
                ].map((s) => (
                  <div key={s.label} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 shadow-ambient">
                    <span className="material-symbols-outlined filled text-2xl" style={{ color: s.color }}>{s.icon}</span>
                    <p className="text-2xl font-black text-on-surface mt-1">{s.value}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setQuizState("review")}
                  className="bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient card-hover"
                >
                  <span className="material-symbols-outlined text-lg">rate_review</span>
                  Review Answers
                </button>
                <button
                  onClick={() => { setCurrentQ(0); setAnswers({}); setShowFeedback(false); setQuizState("question"); }}
                  className="bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient card-hover"
                >
                  <span className="material-symbols-outlined text-lg">replay</span>
                  Retry
                </button>
                <button
                  onClick={() => router.push("/materials")}
                  className="editorial-gradient text-white font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient-md"
                >
                  <span className="material-symbols-outlined text-lg">library_books</span>
                  Back to Study
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── REVIEW ─── */}
          {quizState === "review" && (
            <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-black text-on-surface">Answer Review</h2>
                <button
                  onClick={() => setQuizState("result")}
                  className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Back to results
                </button>
              </div>
              <div className="space-y-4">
                {quiz.questions.map((q, i) => {
                  const ans = answers[i];
                  let correct = false;
                  if (q.type === "matching" || q.type === "ordering") {
                    correct = JSON.stringify(ans) === JSON.stringify(q.correct);
                  } else {
                    correct = ans === q.correct;
                  }
                  return (
                    <div key={i} className={`rounded-2xl p-5 border ${correct ? "bg-secondary-container/20 border-secondary/15" : "bg-error-container/20 border-error/15"}`}>
                      <div className="flex items-start gap-3">
                        <span className={`material-symbols-outlined filled text-xl flex-shrink-0 mt-0.5 ${correct ? "text-secondary" : "text-error"}`}>
                          {correct ? "check_circle" : "cancel"}
                        </span>
                        <div className="flex-1">
                          <p className="font-bold text-on-surface text-sm mb-2">{q.question}</p>
                          <p className="text-xs text-on-surface-variant mb-1">
                            Your answer: <span className="font-semibold text-on-surface">{String(ans || "Skipped")}</span>
                          </p>
                          {!correct && (
                            <p className="text-xs text-on-surface-variant mb-2">
                              Correct: <span className="font-semibold text-secondary">{String(q.correct)}</span>
                            </p>
                          )}
                          <p className="text-xs text-on-surface-variant leading-relaxed italic">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

// ─── Helpers ───────────────────────────────────────────

function typeLabel(type: string) {
  const map: Record<string, string> = {
    mcq: "Multiple Choice",
    truefalse: "True / False",
    fillinblank: "Fill in the Blank",
    matching: "Matching",
    ordering: "Ordering",
  };
  return map[type] || type;
}

function isCorrect(question: { type: string; correct: string | string[] }, answer: string | string[] | undefined): boolean {
  if (!answer) return false;
  if (question.type === "matching" || question.type === "ordering") {
    return JSON.stringify(answer) === JSON.stringify(question.correct);
  }
  return answer === question.correct;
}

// ─── MCQ Input ─────────────────────────────────────────

function MCQInput({
  options, selected, correct, showFeedback, onSelect, color,
}: {
  options: string[]; selected: string; correct: string; showFeedback: boolean;
  onSelect: (v: string) => void; color: string;
}) {
  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const isSelected = selected === opt;
        const isRight = opt === correct;
        let style = "bg-surface-container border-outline-variant/20 hover:bg-surface-container-high";
        if (isSelected && !showFeedback) style = "border-2 text-white";
        if (showFeedback && isRight) style = "bg-secondary-container/40 border-secondary/30";
        if (showFeedback && isSelected && !isRight) style = "bg-error-container/40 border-error/30";

        return (
          <motion.button
            key={opt}
            whileHover={!showFeedback ? { scale: 1.01 } : {}}
            whileTap={!showFeedback ? { scale: 0.99 } : {}}
            onClick={() => !showFeedback && onSelect(opt)}
            disabled={showFeedback}
            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${style}`}
            style={isSelected && !showFeedback ? { backgroundColor: color, borderColor: color } : {}}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected && !showFeedback ? "border-white bg-white/20" : "border-outline-variant"}`}
            >
              {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${showFeedback ? (isCorrect({ type: "mcq", correct }, selected) ? "bg-secondary" : "bg-error") : "bg-white"}`} />}
            </div>
            <span className={`text-sm font-medium ${isSelected && !showFeedback ? "text-white" : "text-on-surface"}`}>{opt}</span>
            {showFeedback && isRight && (
              <span className="material-symbols-outlined filled text-secondary ml-auto text-lg">check_circle</span>
            )}
            {showFeedback && isSelected && !isRight && (
              <span className="material-symbols-outlined filled text-error ml-auto text-lg">cancel</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── True/False ─────────────────────────────────────────

function TrueFalseInput({
  selected, correct, showFeedback, onSelect, color,
}: {
  selected: string; correct: string; showFeedback: boolean; onSelect: (v: string) => void; color: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {["True", "False"].map((opt) => {
        const isSelected = selected === opt;
        const isRight = opt === correct;
        return (
          <motion.button
            key={opt}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.97 } : {}}
            onClick={() => !showFeedback && onSelect(opt)}
            disabled={showFeedback}
            className={`p-6 rounded-2xl border-2 font-bold text-lg transition-all flex flex-col items-center gap-2 ${
              showFeedback && isRight ? "bg-secondary-container/40 border-secondary/30 text-secondary" :
              showFeedback && isSelected && !isRight ? "bg-error-container/40 border-error/30 text-error" :
              isSelected ? "text-white border-transparent" :
              "bg-surface-container border-transparent hover:bg-surface-container-high text-on-surface"
            }`}
            style={isSelected && !showFeedback ? { backgroundColor: color } : {}}
          >
            <span className="text-3xl">{opt === "True" ? "✅" : "❌"}</span>
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Fill in the Blank ──────────────────────────────────

function FillBlankInput({
  value, correct, showFeedback, onChange, color,
}: {
  value: string; correct: string; showFeedback: boolean; onChange: (v: string) => void; color: string;
}) {
  const trimmedVal = value.trim().toLowerCase();
  const trimmedCorrect = correct.trim().toLowerCase();
  const isRight = trimmedVal === trimmedCorrect;

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => !showFeedback && onChange(e.target.value)}
          disabled={showFeedback}
          placeholder="Type your answer here..."
          className={`w-full bg-surface-container-highest px-5 py-4 rounded-2xl text-on-surface font-medium focus:outline-none text-base border-2 transition-all ${
            showFeedback
              ? isRight
                ? "border-secondary bg-secondary-container/20"
                : "border-error bg-error-container/20"
              : "border-transparent focus:border-2"
          }`}
          style={!showFeedback ? { borderColor: value ? color : "transparent" } : {}}
          onKeyDown={(e) => e.key === "Enter" && value && !showFeedback}
        />
        {showFeedback && (
          <span
            className={`absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined filled text-2xl ${isRight ? "text-secondary" : "text-error"}`}
          >
            {isRight ? "check_circle" : "cancel"}
          </span>
        )}
      </div>
      {showFeedback && !isRight && (
        <p className="text-sm text-on-surface-variant">
          Correct answer: <span className="font-bold text-secondary">{correct}</span>
        </p>
      )}
    </div>
  );
}

// ─── Matching ───────────────────────────────────────────

function MatchingInput({
  pairs, value, correct, showFeedback, onChange, color,
}: {
  pairs: { left: string; right: string }[];
  value: string[]; correct: string[]; showFeedback: boolean;
  onChange: (v: string[]) => void; color: string;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});

  const handleLeft = (left: string) => {
    if (showFeedback) return;
    setSelectedLeft(selectedLeft === left ? null : left);
  };

  const handleRight = (right: string) => {
    if (showFeedback || !selectedLeft) return;
    const newMatched = { ...matched, [selectedLeft]: right };
    setMatched(newMatched);
    setSelectedLeft(null);
    const result = pairs.map((p) => `${p.left}|${newMatched[p.left] || ""}`);
    onChange(result);
  };

  const rightOptions = pairs.map((p) => p.right);

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
        Tap a left item, then tap its match on the right
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Term</p>
          {pairs.map((p) => (
            <button
              key={p.left}
              onClick={() => handleLeft(p.left)}
              className={`w-full p-3 rounded-xl text-sm font-semibold text-left border-2 transition-all ${
                selectedLeft === p.left
                  ? "text-white border-transparent"
                  : matched[p.left]
                  ? "bg-surface-container-high border-transparent text-on-surface"
                  : "bg-surface-container border-transparent hover:bg-surface-container-high text-on-surface"
              }`}
              style={selectedLeft === p.left ? { backgroundColor: color, borderColor: color } : {}}
            >
              {p.left}
              {matched[p.left] && <span className="text-[10px] text-on-surface-variant block mt-0.5">→ {matched[p.left]}</span>}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Definition</p>
          {rightOptions.map((r) => {
            const isUsed = Object.values(matched).includes(r);
            const matchedLeft = Object.keys(matched).find((k) => matched[k] === r);
            const expectedLeft = pairs.find((p) => p.right === r)?.left;
            const isCorrectPair = showFeedback && matchedLeft === expectedLeft;
            const isWrongPair = showFeedback && matchedLeft && matchedLeft !== expectedLeft;

            return (
              <button
                key={r}
                onClick={() => handleRight(r)}
                disabled={showFeedback}
                className={`w-full p-3 rounded-xl text-sm font-semibold text-left border-2 transition-all ${
                  showFeedback
                    ? isCorrectPair
                      ? "bg-secondary-container/40 border-secondary/30 text-on-surface"
                      : isWrongPair
                      ? "bg-error-container/40 border-error/30 text-on-surface"
                      : "bg-surface-container border-transparent text-on-surface"
                    : isUsed
                    ? "bg-surface-container-high border-transparent text-on-surface-variant"
                    : selectedLeft
                    ? "bg-surface-container border-dashed border-outline-variant hover:bg-surface-container-high text-on-surface cursor-pointer"
                    : "bg-surface-container border-transparent text-on-surface"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Ordering (Drag & Drop) ─────────────────────────────

function SortableItem({ id, color }: { id: string; color: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-ambient cursor-grab active:cursor-grabbing select-none"
    >
      <span className="material-symbols-outlined text-on-surface-variant text-lg" style={{ cursor: "grab" }}>
        drag_indicator
      </span>
      <span className="text-sm font-medium text-on-surface flex-1">{id}</span>
    </div>
  );
}

function OrderingInput({
  items, value, correct, showFeedback, onChange, color,
}: {
  items: string[]; value: string[]; correct: string[]; showFeedback: boolean;
  onChange: (v: string[]) => void; color: string;
}) {
  const [orderedItems, setOrderedItems] = useState<string[]>(
    value.length === items.length ? value : [...items].sort(() => Math.random() - 0.5)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (showFeedback) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderedItems.indexOf(active.id as string);
      const newIndex = orderedItems.indexOf(over.id as string);
      const newOrder = arrayMove(orderedItems, oldIndex, newIndex);
      setOrderedItems(newOrder);
      onChange(newOrder);
    }
  };

  if (showFeedback) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Correct Order</p>
        {correct.map((item, i) => {
          const userPos = orderedItems.indexOf(item);
          const isRight = userPos === i;
          return (
            <div key={item} className={`flex items-center gap-3 p-4 rounded-2xl border ${isRight ? "bg-secondary-container/30 border-secondary/20" : "bg-error-container/30 border-error/20"}`}>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 text-white`}
                style={{ backgroundColor: isRight ? "#066c4e" : "#ba1a1a" }}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium text-on-surface flex-1">{item}</span>
              <span className={`material-symbols-outlined filled text-lg ${isRight ? "text-secondary" : "text-error"}`}>
                {isRight ? "check_circle" : "cancel"}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
        Drag to reorder
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedItems} strategy={verticalListSortingStrategy}>
          {orderedItems.map((item) => (
            <SortableItem key={item} id={item} color={color} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
