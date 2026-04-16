"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import AppLayout from "@/components/layout/AppLayout";
import { subjects, getSuggestedLessons } from "@/lib/data/content";
import { getDaysUntil, getLevelProgress, formatMinutes } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { profile, progress, streak, session, xp } = useStore();
  const { level, xpInLevel, xpForNext } = getLevelProgress(xp);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile?.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  // Animate progress bars on mount with GSAP
  useEffect(() => {
    async function animate() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Animate subject progress bars
      gsap.utils.toArray<HTMLElement>(".subj-progress-bar").forEach((bar) => {
        const target = bar.dataset.width || "0%";
        gsap.fromTo(bar, { width: "0%" }, {
          width: target,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: bar, start: "top 90%", once: true },
        });
      });

      // Stagger reveal cards
      ScrollTrigger.batch(".dash-card", {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.08,
          }),
        start: "top 88%",
      });
      gsap.set(".dash-card", { opacity: 0, y: 30 });

      // Counter for XP
      const xpEl = document.querySelector(".xp-counter");
      if (xpEl) {
        ScrollTrigger.create({
          trigger: xpEl,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo({ val: 0 }, { val: xp }, {
              duration: 1.5,
              ease: "power2.out",
              onUpdate: function () {
                (xpEl as HTMLElement).textContent = Math.round(
                  (this as { targets: () => Array<{ val: number }> }).targets()[0].val
                ).toLocaleString();
              },
            });
          },
        });
      }
    }
    animate();
  }, [xp]);

  if (!profile) return null;

  const daysUntil = getDaysUntil("2026-08-01");
  const suggestedLessons = getSuggestedLessons(profile.weakSubjects, progress.completedLessons, 3);
  const totalLessons = subjects.reduce((a, s) => a + s.chapters.flatMap((c) => c.lessons).length, 0);
  const completionPct = Math.round((progress.completedLessons.length / totalLessons) * 100);

  const weekData = [40, 65, 55, 85, 70, 95, 80];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── HERO EDITORIAL SECTION ── */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10"
            style={{ background: "linear-gradient(135deg, #570005 0%, #7B1113 100%)" }}
          >
            {/* BG decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-1/2 w-96 h-96 opacity-5 pointer-events-none"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

            <div className="relative z-10 flex-1">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 uppercase tracking-[0.2em] text-xs font-bold mb-4 block"
              >
                Preparation Status: Active
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 -tracking-wider"
              >
                Master the <br />
                <span style={{ color: "#ffb3ac" }}>University Entrance</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-white/80 text-lg max-w-md mb-8 leading-relaxed"
              >
                Structured learning pathways designed to help you secure your slot
                in the premiere university. {profile.name && `Good luck, ${profile.name}!`}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => router.push("/materials")}
                  className="bg-white text-[#7B1113] px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Continue Review
                </button>
                <button
                  onClick={() => router.push("/analytics")}
                  className="bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  View Analytics
                </button>
              </motion.div>
            </div>

            {/* Hero image / stats card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full md:w-[340px] bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4">
                {profile.avatar} {profile.name}&apos;s Stats
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Days to UPCAT", value: daysUntil, icon: "event" },
                  { label: "Day Streak", value: `${streak.currentStreak}🔥`, icon: "local_fire_department" },
                  { label: "XP Earned", value: xp.toLocaleString(), icon: "bolt" },
                  { label: "Level", value: `${level}`, icon: "military_tech" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3">
                    <p className="text-xl font-black text-white">{s.value}</p>
                    <p className="text-[10px] text-white/60 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* XP bar */}
              <div>
                <div className="flex justify-between text-[10px] text-white/60 mb-1.5">
                  <span>Level {level}</span>
                  <span>{xpInLevel}/{xpForNext} XP</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(xpInLevel / xpForNext) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── BENTO GRID — CORE COMPETENCIES ── */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-on-surface -tracking-tight">Core Competencies</h2>
              <p className="text-on-surface-variant mt-1">Focus your study efforts on key UPCAT areas</p>
            </div>
            <button
              onClick={() => router.push("/materials")}
              className="text-[#066c4e] font-bold text-sm flex items-center gap-1 group"
            >
              Explore Catalog
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Science — large */}
            {(() => {
              const s = subjects.find((x) => x.id === "science")!;
              const pct = Math.round((s.chapters.flatMap((c) => c.lessons).filter((l) => progress.completedLessons.includes(l.id)).length / s.chapters.flatMap((c) => c.lessons).length) * 100);
              return (
                <button
                  onClick={() => router.push("/materials/science")}
                  className="md:col-span-2 dash-card cursor-pointer text-left"
                >
                  <div
                    className="rounded-[2rem] p-8 flex flex-col justify-between border-b-4 hover:opacity-95 transition-all h-full"
                    style={{ backgroundColor: "#f6f4eb", borderBottomColor: "rgba(29,158,117,0.2)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(29,158,117,0.05)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f6f4eb"}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider"
                          style={{ backgroundColor: "rgba(29,158,117,0.1)", color: "#1D9E75" }}>
                          SCIENCE
                        </span>
                        <span className="text-on-surface-variant font-mono text-sm">{pct}% Mastery</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Physics &amp; Earth Science</h3>
                      <p className="text-on-surface-variant mb-8 line-clamp-2">
                        Master complex principles from kinematics to environmental science through our interactive modules.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="inline-block editorial-gradient text-white px-6 py-2.5 rounded-xl text-sm font-bold">
                        Launch Module
                      </span>
                      <span className="text-on-surface-variant text-xs">
                        {s.chapters.reduce((a, c) => a + c.lessons.length - (c.lessons.filter((l) => progress.completedLessons.includes(l.id)).length), 0)} Units Left
                      </span>
                    </div>
                  </div>
                </button>
              );
            })()}

            {/* Math */}
            {(() => {
              const s = subjects.find((x) => x.id === "math")!;
              const total = s.chapters.flatMap((c) => c.lessons).length;
              return (
                <button onClick={() => router.push("/materials/math")} className="dash-card cursor-pointer text-left">
                  <div className="rounded-[2rem] p-8 border-b-4 hover:opacity-90 transition-all flex flex-col justify-between h-full"
                    style={{ backgroundColor: "#f6f4eb", borderBottomColor: "rgba(127,119,221,0.2)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(127,119,221,0.05)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f6f4eb"}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider"
                          style={{ backgroundColor: "rgba(127,119,221,0.1)", color: "#7F77DD" }}>
                          MATH
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Advanced Algebra</h3>
                      <p className="text-xs text-on-surface-variant">Quadratic equations, functions, and systems.</p>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-lg font-bold text-on-surface">{total * 15} Qs</span>
                      <span className="material-symbols-outlined" style={{ color: "#7F77DD" }}>trending_up</span>
                    </div>
                  </div>
                </button>
              );
            })()}

            {/* Language */}
            {(() => {
              const s = subjects.find((x) => x.id === "language")!;
              const total = s.chapters.flatMap((c) => c.lessons).length;
              return (
                <button onClick={() => router.push("/materials/language")} className="dash-card cursor-pointer text-left">
                  <div className="rounded-[2rem] p-8 border-b-4 hover:opacity-90 transition-all flex flex-col justify-between h-full"
                    style={{ backgroundColor: "#f6f4eb", borderBottomColor: "rgba(216,90,48,0.2)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(216,90,48,0.05)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f6f4eb"}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider"
                          style={{ backgroundColor: "rgba(216,90,48,0.1)", color: "#D85A30" }}>
                          LANGUAGE
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Proficiency</h3>
                      <p className="text-xs text-on-surface-variant">Grammar, vocabulary, and linguistic reasoning.</p>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-lg font-bold text-on-surface">{total * 14} Qs</span>
                      <span className="material-symbols-outlined" style={{ color: "#D85A30" }}>spellcheck</span>
                    </div>
                  </div>
                </button>
              );
            })()}

            {/* Reading — wide */}
            {(() => {
              const s = subjects.find((x) => x.id === "reading")!;
              const done = s.chapters.flatMap((c) => c.lessons).filter((l) => progress.completedLessons.includes(l.id)).length;
              const total = s.chapters.flatMap((c) => c.lessons).length;
              const pct = Math.round((done / total) * 100);
              return (
                <button onClick={() => router.push("/materials/reading")} className="md:col-span-2 dash-card cursor-pointer text-left">
                  <div className="rounded-[2rem] p-8 border-b-4 hover:opacity-90 transition-all flex flex-col justify-between h-full"
                    style={{ backgroundColor: "#f6f4eb", borderBottomColor: "rgba(186,117,23,0.2)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(186,117,23,0.05)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f6f4eb"}
                  >
                    <div className="flex gap-8">
                      <div className="flex-1">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-4 inline-block"
                          style={{ backgroundColor: "rgba(186,117,23,0.1)", color: "#BA7517" }}>
                          READING
                        </span>
                        <h3 className="text-2xl font-bold mb-4">Critical Comprehension</h3>
                        <p className="text-on-surface-variant text-sm mb-4">
                          Practice analyzing complex texts and identifying main arguments with speed and accuracy.
                        </p>
                        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full subj-progress-bar"
                            data-width={`${Math.max(pct, 15)}%`}
                            style={{ background: "linear-gradient(90deg, #BA7517, #e8b84b)", width: "0%" }}
                          />
                        </div>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                          {pct || 0}% Weekly Goal Achieved
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })()}

            {/* Mock Exam CTA */}
            <button
              onClick={() => router.push("/mock-exams")}
              className="md:col-span-2 dash-card cursor-pointer text-left"
            >
              <div className="bg-[#1c1c17] rounded-[2rem] p-8 text-white flex items-center justify-between group overflow-hidden relative h-full">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2">Full Length Mock Test</h3>
                  <p className="text-white/60 text-sm mb-6 max-w-xs">
                    Simulate the actual 5-hour UPCAT environment with immediate diagnostics.
                  </p>
                  <span className="bg-[#7B1113] hover:bg-[#961a1d] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors inline-block">
                    Start Simulation
                  </span>
                </div>
                <div className="opacity-30 group-hover:opacity-100 transition-opacity duration-500 absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 pointer-events-none">
                  <span className="material-symbols-outlined text-[#7B1113]" style={{ fontSize: "12rem" }}>timer</span>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* ── STATS SECTION ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress chart */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: "#7B1113" }}>auto_graph</span>
              Progress Over Time
            </h3>
            <div ref={barsRef} className="bg-surface-container-low rounded-[2rem] p-8 h-80 flex items-end justify-between gap-4">
              {weekData.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-surface-container rounded-t-xl relative group overflow-hidden"
                  style={{ height: `${h}%` }}
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "back.out(1.4)" }}
                >
                  <div
                    className="absolute inset-0 h-0 group-hover:h-full transition-all duration-300 rounded-t-xl"
                    style={{ backgroundColor: i === 5 ? "#066c4e" : i === 3 ? "#7B1113" : "rgba(123,17,19,0.2)" }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
              {weekDays.map((d) => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Streak + stats */}
          <div
            className="rounded-[2rem] p-8 dash-card"
            style={{ backgroundColor: "#f0eee5" }}
          >
            <h3 className="text-xl font-bold mb-6">Study Streak</h3>
            <div className="text-center mb-8">
              <span className="text-7xl font-black text-[#7B1113] xp-counter">
                {streak.currentStreak}
              </span>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mt-2">
                Day Streak
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/50 p-3 rounded-2xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(6,108,78,0.1)", color: "#066c4e" }}>
                  <span className="material-symbols-outlined text-sm">bolt</span>
                </div>
                <div>
                  <p className="text-xs font-bold">Total XP</p>
                  <p className="text-xs text-on-surface-variant">{xp.toLocaleString()} points</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/50 p-3 rounded-2xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(127,119,221,0.1)", color: "#7F77DD" }}>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </div>
                <div>
                  <p className="text-xs font-bold">Lessons Completed</p>
                  <p className="text-xs text-on-surface-variant">{progress.completedLessons.length} of {totalLessons}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/50 p-3 rounded-2xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(186,117,23,0.1)", color: "#BA7517" }}>
                  <span className="material-symbols-outlined text-sm">schedule</span>
                </div>
                <div>
                  <p className="text-xs font-bold">Total Study Time</p>
                  <p className="text-xs text-on-surface-variant">{formatMinutes(session.totalMinutes)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUGGESTED LESSONS ── */}
        {suggestedLessons.length > 0 && (
          <section className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ color: "#7B1113" }}>
                  {profile.weakSubjects.length > 0 ? "priority_high" : "recommend"}
                </span>
                {profile.weakSubjects.length > 0 ? "Priority Lessons" : "Suggested for You"}
              </h3>
              <button
                onClick={() => router.push("/materials")}
                className="text-[#066c4e] font-bold text-sm flex items-center gap-1 group"
              >
                View all
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestedLessons.map((lesson, i) => (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => router.push(`/materials/${lesson.subject.id}/${lesson.chapter.id}/${lesson.id}`)}
                  className="bg-white rounded-2xl p-5 border hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group"
                  style={{ borderColor: "rgba(223,191,188,0.2)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: lesson.subject.bgColor }}>
                      <span className="material-symbols-outlined filled text-xl" style={{ color: lesson.subject.color }}>
                        {lesson.subject.icon}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: lesson.subject.color }}>
                        {lesson.subject.title}
                      </span>
                      {profile.weakSubjects.includes(lesson.subject.id as never) && (
                        <span className="text-[9px] bg-[#ffdad6] text-[#7B1113] font-bold px-1.5 py-0.5 rounded-full">PRIORITY</span>
                      )}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface mb-1 group-hover:text-[#7B1113] transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">{lesson.duration} min · +{lesson.xp} XP</p>
                </motion.button>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
