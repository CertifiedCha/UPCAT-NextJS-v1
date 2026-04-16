"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line, CartesianGrid,
} from "recharts";
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/lib/store";
import { subjects } from "@/lib/data/content";
import { getLastNDays, getLevelProgress, formatMinutes } from "@/lib/utils";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 28 } } };

export default function AnalyticsPage() {
  const { profile, progress, streak, session, xp } = useStore();
  const { level, progress: xpProgress, xpInLevel, xpForNext } = getLevelProgress(xp);

  // Subject accuracy from quiz scores
  const subjectAccuracy = useMemo(() => {
    return subjects.map((s) => {
      const allLessons = s.chapters.flatMap((c) => c.lessons);
      const doneLessons = allLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
      const pct = allLessons.length > 0 ? Math.round((doneLessons / allLessons.length) * 100) : 0;

      // Get quiz scores for this subject
      const subjectQuizScores = Object.entries(progress.quizScores)
        .filter(([id]) => id.includes(s.id.substring(0, 3)))
        .map(([, score]) => score);

      const avgScore = subjectQuizScores.length
        ? Math.round(subjectQuizScores.reduce((a, b) => a + b, 0) / subjectQuizScores.length)
        : 0;

      return {
        subject: s.title.split(" ")[0],
        fullName: s.title,
        completion: pct,
        quizAvg: avgScore || pct, // fallback to completion if no quizzes
        color: s.color,
        bgColor: s.bgColor,
        icon: s.icon,
      };
    });
  }, [progress]);

  // Radar data
  const radarData = subjectAccuracy.map((s) => ({
    subject: s.subject,
    score: s.quizAvg,
    fullMark: 100,
  }));

  // Daily activity (last 28 days)
  const last28Days = getLastNDays(28);
  const dailyData = last28Days.map((date) => ({
    date: date.slice(5), // MM-DD
    minutes: session.dailyMinutes[date] || 0,
    studied: streak.studyDates.includes(date),
  }));

  // Heatmap (last 84 days = 12 weeks)
  const last84Days = getLastNDays(84);
  const heatmapData = last84Days.map((date) => ({
    date,
    minutes: session.dailyMinutes[date] || 0,
    studied: streak.studyDates.includes(date),
  }));

  // Group heatmap into weeks
  const weeks: typeof heatmapData[] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  // Line chart for cumulative XP (mock progression)
  const xpProgression = last28Days.map((date, i) => ({
    date: date.slice(5),
    xp: Math.round((xp / 28) * (i + 1) * (0.8 + Math.random() * 0.4)),
  }));

  // Subject time breakdown
  const subjectTimeData = subjects.map((s) => ({
    name: s.title.split(" ")[0],
    minutes: session.subjectMinutes[s.id as keyof typeof session.subjectMinutes] || 0,
    color: s.color,
  }));

  const heatmapIntensity = (minutes: number) => {
    if (minutes === 0) return "#f0eee5";
    if (minutes < 15) return "#ffdad6";
    if (minutes < 30) return "#ffb3ac";
    if (minutes < 60) return "#891c1b";
    return "#570005";
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

          {/* Header */}
          <motion.div variants={item}>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Analytics</p>
            <h1 className="font-display text-4xl font-black text-on-surface leading-tight">
              Your learning data,<br />
              <span className="text-on-surface-variant font-light italic">beautifully visualized.</span>
            </h1>
          </motion.div>

          {/* Top stat cards */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Current Streak", value: `${streak.currentStreak}d`, icon: "local_fire_department", color: "#D85A30", bg: "rgba(216,90,48,0.1)", sub: `Best: ${streak.longestStreak}d` },
              { label: "Total Study Time", value: formatMinutes(session.totalMinutes), icon: "schedule", color: "#7F77DD", bg: "rgba(127,119,221,0.1)", sub: "All time" },
              { label: "Lessons Complete", value: `${progress.completedLessons.length}`, icon: "check_circle", color: "#1D9E75", bg: "rgba(29,158,117,0.1)", sub: `of ${subjects.reduce((a, s) => a + s.chapters.flatMap(c => c.lessons).length, 0)} total` },
              { label: "Quizzes Passed", value: `${Object.values(progress.quizScores).filter(s => s >= 60).length}`, icon: "quiz", color: "#BA7517", bg: "rgba(186,117,23,0.1)", sub: `${progress.completedQuizzes.length} taken` },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 shadow-ambient">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: stat.bg }}>
                  <span className="material-symbols-outlined filled text-xl" style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <p className="text-2xl font-black text-on-surface">{stat.value}</p>
                <p className="text-xs font-bold text-on-surface">{stat.label}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* XP Level card */}
          <motion.div variants={item} className="editorial-gradient rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,218,214,0.2)" strokeWidth="8" />
                  <motion.circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke="#ffdad6" strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 201" }}
                    animate={{ strokeDasharray: `${xpProgress * 2.01} 201` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-primary-fixed">Lv</span>
                  <span className="text-2xl font-black text-primary-fixed leading-none">{level}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed/70 mb-1">Experience Points</p>
                <p className="text-3xl font-black text-primary-fixed">{xp.toLocaleString()} XP</p>
                <div className="mt-3 h-2 bg-primary-fixed/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-fixed rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                  />
                </div>
                <p className="text-[10px] text-primary-fixed/60 mt-1">{xpInLevel} / {xpForNext} XP to Level {level + 1}</p>
              </div>
            </div>
          </motion.div>

          {/* Charts row 1 — Radar + Bar */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Radar chart */}
            <motion.div variants={item} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-ambient">
              <h3 className="font-bold text-on-surface text-sm mb-1">Subject Strength Radar</h3>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-5">Based on completion + quiz scores</p>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                  <PolarGrid stroke="#f0eee5" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fontWeight: 700, fill: "#58413f" }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#7B1113"
                    fill="#7B1113"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {subjectAccuracy.map((s) => (
                  <div key={s.subject} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[10px] text-on-surface-variant font-medium">{s.subject}</span>
                    <span className="text-[10px] font-black ml-auto" style={{ color: s.color }}>{s.quizAvg}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Subject progress bars */}
            <motion.div variants={item} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-ambient">
              <h3 className="font-bold text-on-surface text-sm mb-1">Lesson Completion</h3>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-6">Progress per subject</p>
              <div className="space-y-5">
                {subjectAccuracy.map((s, i) => (
                  <div key={s.subject}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bgColor }}>
                        <span className="material-symbols-outlined filled" style={{ color: s.color, fontSize: 16 }}>{s.icon}</span>
                      </div>
                      <span className="text-xs font-bold text-on-surface flex-1">{s.fullName}</span>
                      <span className="text-sm font-black" style={{ color: s.color }}>{s.completion}%</span>
                    </div>
                    <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: s.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.completion}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Daily activity bar chart */}
          <motion.div variants={item} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-ambient">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-on-surface text-sm">Daily Study Activity</h3>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Last 28 days · minutes</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-on-surface">{formatMinutes(session.totalMinutes)}</p>
                <p className="text-[10px] text-on-surface-variant">total studied</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eee5" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "#58413f" }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis tick={{ fontSize: 9, fill: "#58413f" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(223,191,188,0.2)",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                  formatter={(v: number) => [`${v} min`, "Study Time"]}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={20}>
                  {dailyData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.minutes > 0 ? "#7B1113" : "#f0eee5"}
                      opacity={entry.minutes > 0 ? 1 : 0.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Heatmap */}
          <motion.div variants={item} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-ambient">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-on-surface text-sm">Study Heatmap</h3>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Last 12 weeks</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-on-surface-variant">Less</span>
                {["#f0eee5", "#ffdad6", "#ffb3ac", "#891c1b", "#570005"].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                <span className="text-[10px] text-on-surface-variant">More</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-1 pt-6">
                  {weekDays.map((d, i) => (
                    <div key={d} className={`h-3 text-[8px] text-on-surface-variant font-medium flex items-center ${i % 2 === 0 ? "" : "opacity-0"}`}>
                      {d}
                    </div>
                  ))}
                </div>

                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {/* Month label for first week of month */}
                    <div className="h-5 text-[8px] text-on-surface-variant font-medium">
                      {week[0] && new Date(week[0].date).getDate() <= 7
                        ? new Date(week[0].date).toLocaleString("default", { month: "short" })
                        : ""}
                    </div>
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className="w-3 h-3 rounded-sm transition-all cursor-default"
                        style={{ backgroundColor: heatmapIntensity(day.minutes) }}
                        title={`${day.date}: ${day.minutes}min`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="text-sm font-black text-on-surface">{streak.currentStreak} day streak</p>
                  <p className="text-[10px] text-on-surface-variant">Current · Best: {streak.longestStreak}d</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="material-symbols-outlined filled text-secondary text-lg">calendar_month</span>
                <p className="text-xs text-on-surface-variant">
                  <span className="font-bold text-on-surface">{streak.studyDates.length}</span> days studied total
                </p>
              </div>
            </div>
          </motion.div>

          {/* XP progression line */}
          <motion.div variants={item} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-ambient">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-on-surface text-sm">XP Progression</h3>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Cumulative · last 28 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-on-surface">{xp.toLocaleString()}</p>
                <p className="text-[10px] text-on-surface-variant">total XP</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={xpProgression} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eee5" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#58413f" }} tickLine={false} axisLine={false} interval={6} />
                <YAxis tick={{ fontSize: 9, fill: "#58413f" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid rgba(223,191,188,0.2)", borderRadius: "12px", fontSize: "11px" }}
                  formatter={(v: number) => [`${v} XP`, "Cumulative XP"]}
                />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="#7B1113"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#7B1113" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quiz scores breakdown */}
          {Object.keys(progress.quizScores).length > 0 && (
            <motion.div variants={item} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-ambient">
              <h3 className="font-bold text-on-surface text-sm mb-5">Quiz Score History</h3>
              <div className="space-y-3">
                {Object.entries(progress.quizScores).map(([quizId, score]) => {
                  const subjectId = quizId.split("-")[1];
                  const subject = subjects.find((s) => s.id === subjectId || quizId.includes(s.id.substring(0, 3)));
                  return (
                    <div key={quizId} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: subject?.bgColor || "rgba(136,135,128,0.1)" }}
                      >
                        <span className="material-symbols-outlined filled" style={{ color: subject?.color || "#888780", fontSize: 16 }}>
                          quiz
                        </span>
                      </div>
                      <span className="text-xs font-medium text-on-surface flex-1 truncate">{quizId}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${score}%`,
                              backgroundColor: score >= 80 ? "#066c4e" : score >= 60 ? "#BA7517" : "#ba1a1a",
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-black w-8 text-right ${score >= 80 ? "text-secondary" : score >= 60 ? "text-subject-reading" : "text-error"}`}
                        >
                          {score}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Empty state if no data */}
          {progress.completedLessons.length === 0 && (
            <motion.div variants={item} className="text-center py-16 bg-surface-container rounded-2xl border border-outline-variant/10">
              <span className="text-5xl">📊</span>
              <h3 className="font-bold text-on-surface text-lg mt-4 mb-2">No data yet</h3>
              <p className="text-sm text-on-surface-variant mb-6">Complete lessons and quizzes to see your analytics fill up.</p>
              <a
                href="/materials"
                className="editorial-gradient text-white font-bold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">library_books</span>
                Start Studying
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
