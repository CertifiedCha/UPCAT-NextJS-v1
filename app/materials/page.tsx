"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { subjects } from "@/lib/data/content";
import { useStore } from "@/lib/store";

export default function MaterialsPage() {
  const router = useRouter();
  const { progress } = useStore();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function animate() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Subject cards — hover scale already in CSS, animate in with batch
      ScrollTrigger.batch(".subj-card-item", {
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "back.out(1.7)",
          stagger: 0.1,
        }),
        start: "top 88%",
        once: true,
      });
      gsap.set(".subj-card-item", { opacity: 0, y: 36 });
    }
    animate();
  }, []);

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">

        {/* Hero */}
        <section className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[0.75rem] font-bold uppercase tracking-[0.05em] mb-2 block"
            style={{ color: "#066c4e" }}
          >
            Curation of Knowledge
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl font-extrabold text-on-surface mb-4 -tracking-tight"
          >
            Study Materials
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-on-surface-variant max-w-2xl leading-relaxed"
          >
            Access a refined archive of academic resources tailored for the UPCAT.
            Master each domain with materials curated by the Modern Archivist.
          </motion.p>
        </section>

        {/* ── SUBJECT CARDS (matches prototype exactly) ── */}
        <section className="mb-20">
          <div
            ref={gridRef}
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {subjects.map((subj) => {
              const allLessons = subj.chapters.flatMap((c) => c.lessons);
              const done = allLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
              const pct = Math.round((done / allLessons.length) * 100);

              return (
                <div
                  key={subj.id}
                  className="subj-card-item group relative overflow-hidden rounded-xl bg-white flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all"
                  style={{
                    minHeight: 280,
                    border: "1px solid rgba(223,191,188,0.2)",
                    opacity: 0,
                  }}
                  onClick={() => router.push(`/materials/${subj.id}`)}
                >
                  {/* Icon area */}
                  <div
                    className="h-36 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: subj.bgColor }}
                  >
                    <span
                      className="material-symbols-outlined filled text-5xl opacity-40 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: subj.color }}
                    >
                      {subj.icon}
                    </span>
                    {/* Gradient overlay to white */}
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, transparent 40%, white 100%)" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-4 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-on-surface mb-2">{subj.title}</h3>
                    <p className="text-sm text-on-surface-variant flex-1 mb-3">{subj.description}</p>

                    {/* Progress bar */}
                    {done > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mb-1">
                          <span>{done}/{allLessons.length} lessons</span>
                          <span style={{ color: subj.color }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: subj.color }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      className="w-full py-2 rounded-lg font-semibold text-sm transition-colors"
                      style={{
                        border: `1px solid ${subj.color}40`,
                        color: subj.color,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = subj.bgColor;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {done === 0 ? "Browse Materials" : done === allLessons.length ? "Review" : "Continue"}
                    </button>
                  </div>

                  {/* Badge */}
                  <div
                    className="absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ backgroundColor: subj.color }}
                  >
                    {pct >= 100 ? "Complete ✓" : "Core"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SUPPLEMENTAL ARCHIVE ── */}
        <section>
          <div
            className="flex items-end justify-between mb-8 pb-4"
            style={{ borderBottom: "1px solid rgba(223,191,188,0.1)" }}
          >
            <div>
              <h3 className="text-2xl font-bold text-on-surface mb-1">Supplemental Archive</h3>
              <p className="text-sm text-on-surface-variant">Supporting documents and miscellaneous study aids.</p>
            </div>
            <button
              onClick={() => router.push("/archive")}
              className="font-semibold flex items-center gap-2 text-sm hover:underline"
              style={{ color: "#066c4e" }}
            >
              View Entire Archive
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured resource */}
            <div className="lg:col-span-2 group cursor-pointer relative overflow-hidden rounded-xl h-64"
              style={{ backgroundColor: "#002115" }}
              onClick={() => router.push("/archive")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Legacy Archive"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80"
              />
              <div className="absolute inset-0 opacity-60"
                style={{ background: "linear-gradient(to right, #066c4e, transparent)" }} />
              <div className="relative p-10 h-full flex flex-col justify-end">
                <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full w-fit text-[10px] font-bold uppercase tracking-widest mb-4 text-white">
                  Most Popular
                </div>
                <h4 className="text-3xl font-black mb-2 tracking-tight text-white">
                  Legacy Entrance Questions (PDF)
                </h4>
                <p className="text-white/70 text-sm">
                  Past exam papers compiled and organized by subject and year.
                </p>
              </div>
            </div>

            {/* Quick archive links */}
            <div className="space-y-4">
              {[
                { label: "Formula Sheets", sub: "Math & Science", icon: "calculate", color: "#7F77DD" },
                { label: "Vocabulary Lists", sub: "Language · 500 words", icon: "translate", color: "#D85A30" },
                { label: "Video Lectures", sub: "All subjects", icon: "play_circle", color: "#1D9E75" },
                { label: "Cheat Sheets", sub: "Quick references", icon: "receipt_long", color: "#BA7517" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push("/archive")}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container transition-all text-left group"
                  style={{ border: "1px solid rgba(223,191,188,0.15)" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}15` }}>
                    <span className="material-symbols-outlined filled text-lg" style={{ color: item.color }}>
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">{item.label}</p>
                    <p className="text-[10px] text-on-surface-variant">{item.sub}</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Mock Exam CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => router.push("/mock-exams")}
          className="mt-12 w-full rounded-[2rem] p-8 flex items-center gap-5 hover:opacity-95 transition-opacity text-left overflow-hidden relative"
          style={{ backgroundColor: "#1c1c17" }}
        >
          <div className="relative z-10 flex-1">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Ready to test yourself?</p>
            <p className="font-black text-white text-2xl mb-2">Take a Full Mock Exam</p>
            <p className="text-white/60 text-sm">Timed · All subjects · Real UPCAT format</p>
          </div>
          <span className="text-white font-bold px-6 py-3 rounded-xl text-sm relative z-10"
            style={{ backgroundColor: "#7B1113" }}>
            Start Simulation
          </span>
          <div className="opacity-20 absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 pointer-events-none">
            <span className="material-symbols-outlined text-[#7B1113]" style={{ fontSize: "10rem" }}>assignment</span>
          </div>
        </motion.button>
      </div>
    </AppLayout>
  );
}
