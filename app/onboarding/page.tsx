"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type Subject } from "@/lib/store";

const TOTAL_STEPS = 5;

const AVATARS = ["🧑‍🎓", "👩‍🎓", "🧑‍💻", "👩‍💻", "🧑‍🔬", "👩‍🔬", "📚", "⚡"];

const UPCAT_DATES = [
  "August 2025",
  "August 2026",
  "August 2027",
  "Not sure yet",
];

const subjects: { id: Subject; label: string; icon: string; color: string; bg: string }[] = [
  { id: "math", label: "Mathematics", icon: "calculate", color: "#7F77DD", bg: "rgba(127,119,221,0.1)" },
  { id: "science", label: "Science", icon: "science", color: "#1D9E75", bg: "rgba(29,158,117,0.1)" },
  { id: "language", label: "Language", icon: "translate", color: "#D85A30", bg: "rgba(216,90,48,0.1)" },
  { id: "reading", label: "Reading", icon: "menu_book", color: "#BA7517", bg: "rgba(186,117,23,0.1)" },
];

const studyGoals = [
  { label: "Light", value: 30, desc: "30 min / day", icon: "wb_sunny" },
  { label: "Focused", value: 60, desc: "1 hour / day", icon: "local_fire_department" },
  { label: "Intensive", value: 120, desc: "2 hours / day", icon: "bolt" },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧑‍🎓");
  const [targetDate, setTargetDate] = useState("");
  const [weakSubjects, setWeakSubjects] = useState<Subject[]>([]);
  const [strongSubjects, setStrongSubjects] = useState<Subject[]>([]);
  const [dailyGoal, setDailyGoal] = useState(60);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const toggleSubject = (
    subj: Subject,
    list: Subject[],
    setList: (l: Subject[]) => void
  ) => {
    setList(
      list.includes(subj) ? list.filter((s) => s !== subj) : [...list, subj]
    );
  };

  const handleFinish = () => {
    setProfile({
      name: name || "Scholar",
      targetDate: targetDate || "August 2026",
      weakSubjects,
      strongSubjects,
      dailyGoalMinutes: dailyGoal,
      onboardingComplete: true,
      avatar,
    });
    router.push("/dashboard");
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return targetDate !== "";
    if (step === 2) return true; // optional
    if (step === 3) return true; // optional
    if (step === 4) return true;
    return true;
  };

  const steps = [
    // Step 0 — Name & Avatar
    <div key="name" className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">{avatar}</div>
        <h2 className="font-display text-3xl font-black text-on-surface mb-2">
          Let&apos;s get you set up
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          First, tell us a little about yourself.
        </p>
      </div>

      {/* Avatar picker */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Pick your avatar
        </p>
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all ${
                avatar === a
                  ? "editorial-gradient shadow-ambient-md scale-105"
                  : "bg-surface-container hover:bg-surface-container-high"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Name input */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Your name
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Maria Santos"
          className="w-full bg-surface-container-highest px-4 py-3.5 rounded-xl text-on-surface placeholder:text-on-surface-variant/40 font-medium focus:outline-none focus:ring-2 focus:ring-primary-container border-none text-sm"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && canProceed() && goNext()}
        />
      </div>
    </div>,

    // Step 1 — Target UPCAT date
    <div key="date" className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="font-display text-3xl font-black text-on-surface mb-2">
          When are you taking the UPCAT?
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          This helps us plan your review timeline and keep you on track.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {UPCAT_DATES.map((date) => (
          <button
            key={date}
            onClick={() => setTargetDate(date)}
            className={`p-4 rounded-2xl text-sm font-bold text-left transition-all ${
              targetDate === date
                ? "editorial-gradient text-white shadow-ambient-md"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg mr-2 align-middle">
              {date === "Not sure yet" ? "help_outline" : "event"}
            </span>
            {date}
          </button>
        ))}
      </div>
    </div>,

    // Step 2 — Weak subjects
    <div key="weak" className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">😬</div>
        <h2 className="font-display text-3xl font-black text-on-surface mb-2">
          Which subjects scare you?
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          We&apos;ll prioritize these on your dashboard. No judgment.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {subjects.map((s) => {
          const selected = weakSubjects.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleSubject(s.id, weakSubjects, setWeakSubjects)}
              className={`p-4 rounded-2xl text-left transition-all border-2 ${
                selected
                  ? "border-primary-container bg-primary-fixed/30 shadow-ambient-md"
                  : "border-transparent bg-surface-container hover:bg-surface-container-high"
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: s.bg }}
              >
                <span className="material-symbols-outlined filled" style={{ color: s.color, fontSize: 20 }}>
                  {s.icon}
                </span>
              </div>
              <p className="text-sm font-bold text-on-surface">{s.label}</p>
              {selected && (
                <p className="text-[10px] text-primary-container font-bold mt-1">Priority subject ✓</p>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-on-surface-variant">
        Skip if you haven&apos;t decided yet — you can update this later
      </p>
    </div>,

    // Step 3 — Strong subjects
    <div key="strong" className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">💪</div>
        <h2 className="font-display text-3xl font-black text-on-surface mb-2">
          Where are you strongest?
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          We&apos;ll still cover these — but we&apos;ll know you&apos;ve got a head start.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {subjects.map((s) => {
          const selected = strongSubjects.includes(s.id);
          const isWeak = weakSubjects.includes(s.id);
          return (
            <button
              key={s.id}
              disabled={isWeak}
              onClick={() => toggleSubject(s.id, strongSubjects, setStrongSubjects)}
              className={`p-4 rounded-2xl text-left transition-all border-2 ${
                isWeak
                  ? "border-transparent bg-surface-container opacity-40 cursor-not-allowed"
                  : selected
                  ? "border-secondary bg-secondary-container/30 shadow-ambient-md"
                  : "border-transparent bg-surface-container hover:bg-surface-container-high"
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: s.bg }}
              >
                <span className="material-symbols-outlined filled" style={{ color: s.color, fontSize: 20 }}>
                  {s.icon}
                </span>
              </div>
              <p className="text-sm font-bold text-on-surface">{s.label}</p>
              {selected && (
                <p className="text-[10px] text-secondary font-bold mt-1">Strong subject ✓</p>
              )}
              {isWeak && (
                <p className="text-[10px] text-on-surface-variant mt-1">Marked as weak</p>
              )}
            </button>
          );
        })}
      </div>
    </div>,

    // Step 4 — Daily goal
    <div key="goal" className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">⏰</div>
        <h2 className="font-display text-3xl font-black text-on-surface mb-2">
          How much can you study daily?
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Consistency beats intensity. Pick something you can actually stick to.
        </p>
      </div>
      <div className="space-y-3">
        {studyGoals.map((g) => (
          <button
            key={g.label}
            onClick={() => setDailyGoal(g.value)}
            className={`w-full p-5 rounded-2xl text-left flex items-center gap-4 transition-all border-2 ${
              dailyGoal === g.value
                ? "editorial-gradient border-transparent text-white shadow-ambient-md"
                : "bg-surface-container border-transparent hover:bg-surface-container-high text-on-surface"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                dailyGoal === g.value ? "bg-white/20" : "bg-surface-container-high"
              }`}
            >
              <span
                className={`material-symbols-outlined filled text-2xl ${
                  dailyGoal === g.value ? "text-white" : "text-on-surface-variant"
                }`}
              >
                {g.icon}
              </span>
            </div>
            <div>
              <p className={`font-bold ${dailyGoal === g.value ? "text-white" : "text-on-surface"}`}>
                {g.label}
              </p>
              <p className={`text-sm ${dailyGoal === g.value ? "text-white/70" : "text-on-surface-variant"}`}>
                {g.desc}
              </p>
            </div>
            {dailyGoal === g.value && (
              <span className="material-symbols-outlined filled text-white ml-auto">check_circle</span>
            )}
          </button>
        ))}
      </div>

      {/* Preview card */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Your Profile Preview
        </p>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{avatar}</span>
          <div>
            <p className="font-bold text-on-surface">{name || "Scholar"}</p>
            <p className="text-xs text-on-surface-variant">
              UPCAT {targetDate || "2026"} · {dailyGoal} min/day goal
            </p>
            {weakSubjects.length > 0 && (
              <p className="text-xs text-primary-container font-semibold mt-0.5">
                Priority: {weakSubjects.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-12">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i < step
                ? "bg-secondary w-6"
                : i === step
                ? "bg-primary-container w-8"
                : "bg-surface-container-high w-4"
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-3xl shadow-ambient-lg p-8 border border-outline-variant/10 min-h-[480px] flex flex-col justify-between">
          {/* Step content */}
          <div className="flex-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {steps[step]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant/10">
            <button
              onClick={goPrev}
              disabled={step === 0}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-all px-4 py-2.5 rounded-xl ${
                step === 0
                  ? "text-on-surface-variant/30 cursor-not-allowed"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back
            </button>

            <span className="text-xs font-bold text-on-surface-variant">
              {step + 1} / {TOTAL_STEPS}
            </span>

            {step === TOTAL_STEPS - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinish}
                className="editorial-gradient text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-ambient-md"
              >
                Let&apos;s Go!
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                onClick={canProceed() ? goNext : undefined}
                className={`font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all ${
                  canProceed()
                    ? "editorial-gradient text-white shadow-ambient-md"
                    : "bg-surface-container text-on-surface-variant cursor-not-allowed"
                }`}
              >
                Continue
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Skip */}
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <button
            onClick={goNext}
            className="w-full mt-4 text-center text-xs text-on-surface-variant hover:text-on-surface transition-colors py-2"
          >
            Skip for now
          </button>
        )}
      </div>

      {/* Back to home */}
      <a
        href="/"
        className="mt-8 text-xs text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to home
      </a>
    </div>
  );
}
