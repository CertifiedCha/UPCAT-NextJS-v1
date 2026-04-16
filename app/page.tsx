"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);

  const navRef = useRef<HTMLElement>(null);
  const heroTagRef = useRef<HTMLSpanElement>(null);
  const heroH1Ref = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const heroCardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const subjectsRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile?.onboardingComplete) {
      router.replace("/dashboard");
    }
  }, [profile, router]);

  useEffect(() => {
    async function boot() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // ── 1. NAV SLIDE IN ──
      gsap.fromTo(navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power4.out" }
      );

      // ── 2. HERO TIMELINE — char-by-char headline + elastic entrances ──
      const heroTl = gsap.timeline({ delay: 0.3 });

      // Eyebrow tag
      heroTl.fromTo(heroTagRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.7, ease: "power3.out" }
      );

      // Headline — split by words, stagger with back.out
      if (heroH1Ref.current) {
        const words = heroH1Ref.current.querySelectorAll(".word");
        heroTl.fromTo(words,
          { y: "110%", opacity: 0, rotationX: -40 },
          { y: "0%", opacity: 1, rotationX: 0, duration: 0.8, ease: "back.out(1.7)", stagger: 0.08 },
          "<0.2"
        );
      }

      // Subtitle
      heroTl.fromTo(heroSubRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      );

      // CTA buttons — elastic pop
      heroTl.fromTo(heroCtaRef.current?.children || [],
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "elastic.out(1, 0.6)", stagger: 0.1 },
        "-=0.3"
      );

      // Hero floating UI cards — stagger with rotation
      if (heroCardsRef.current) {
        const cards = heroCardsRef.current.querySelectorAll(".hero-card");
        heroTl.fromTo(cards,
          { y: 60, opacity: 0, rotation: (i) => [3, -2, 2, -3, 1][i] || 0, scale: 0.88 },
          { y: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.9, ease: "back.out(1.4)", stagger: 0.12 },
          "-=0.5"
        );

        // Continuous gentle float per card
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: i % 2 === 0 ? -10 : 10,
            rotation: i % 3 === 0 ? 1 : -1,
            duration: 2.5 + i * 0.7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5,
          });
        });
      }

      // ── 3. VELOCITY SKEW ON SCROLL ──
      const skewProxy = { skewY: 0 };
      let lastScrollY = 0;
      ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = self.getVelocity() / 3000;
          gsap.to(".skew-on-scroll", {
            skewY: -velocity * 5,
            ease: "power3",
            duration: 0.4,
            overwrite: true,
          });
        },
      });

      // ── 4. STATS COUNTER ON SCROLL ──
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll(".stat-count");
        counters.forEach((el) => {
          const target = parseInt(el.getAttribute("data-target") || "0");
          const suffix = el.getAttribute("data-suffix") || "";
          ScrollTrigger.create({
            trigger: el,
            start: "top 82%",
            once: true,
            onEnter: () => {
              gsap.fromTo({ val: 0 }, { val: target }, {
                duration: 1.8,
                ease: "power2.out",
                onUpdate: function () {
                  (el as HTMLElement).textContent =
                    Math.round((this as { targets: () => Array<{ val: number }> }).targets()[0].val).toLocaleString() + suffix;
                },
              });
            },
          });
        });

        // Clip-path wipe reveal for stat cards
        gsap.fromTo(statsRef.current.querySelectorAll(".stat-card"),
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: statsRef.current, start: "top 78%", once: true },
          }
        );
      }

      // ── 5. FEATURES — ScrollTrigger.batch ──
      if (featuresRef.current) {
        ScrollTrigger.batch(featuresRef.current.querySelectorAll(".feature-card"), {
          onEnter: (batch) => gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.7)",
            stagger: 0.09,
          }),
          start: "top 85%",
          once: true,
        });
        gsap.set(featuresRef.current.querySelectorAll(".feature-card"), {
          opacity: 0, y: 40, scale: 0.93,
        });
      }

      // ── 6. SUBJECT CARDS — horizontal clip-path wipe ──
      if (subjectsRef.current) {
        const cards = subjectsRef.current.querySelectorAll(".subj-card");
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { clipPath: "inset(0 100% 0 0)", x: 40 },
            {
              clipPath: "inset(0 0% 0 0)",
              x: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%", once: true },
              delay: i * 0.1,
            }
          );
        });
      }

      // ── 7. MARQUEE endless scroll ──
      if (marqueeRef.current) {
        const track = marqueeRef.current.querySelector(".marquee-track") as HTMLElement;
        if (track) {
          gsap.to(track, {
            x: "-50%",
            duration: 20,
            ease: "none",
            repeat: -1,
          });
        }
      }

      // ── 8. CTA SECTION — parallax depth ──
      gsap.to(".cta-bg-circle-1", {
        y: -80,
        scrollTrigger: { trigger: ".cta-section", scrub: 1.5 },
      });
      gsap.to(".cta-bg-circle-2", {
        y: 60,
        scrollTrigger: { trigger: ".cta-section", scrub: 1.5 },
      });
    }

    boot();
    return () => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.getAll().forEach((t) => t.kill()));
    };
  }, []);

  // Word-wrap helper for the headline
  const headlineWords = ["Master", "the", "University", "Entrance", "Exam."];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#fcf9f1", color: "#1c1c17" }}>

      {/* ── NAV ── */}
      <nav
        ref={navRef}
        className="fixed top-0 w-full z-50"
        style={{
          backgroundColor: "rgba(252,249,241,0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(223,191,188,0.2)",
          opacity: 0,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-[#7B1113] font-black tracking-tighter text-2xl">UPCAT Hub</span>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Subjects", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                {item}
              </a>
            ))}
          </div>
          <Link
            href="/onboarding"
            className="text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#570005,#7B1113)" }}
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1c1c17" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Ambient blobs */}
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] pointer-events-none opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #7B1113 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 pointer-events-none opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #066c4e 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left */}
          <div>
            <span
              ref={heroTagRef}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
              style={{ backgroundColor: "rgba(255,218,214,0.6)", color: "#891c1b", clipPath: "inset(0 100% 0 0)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#7B1113" }} />
              UPCAT 2025 · Start Reviewing Now
            </span>

            <h1
              ref={heroH1Ref}
              className="text-5xl md:text-7xl font-extrabold leading-[1.0] -tracking-wider mb-8"
              style={{ overflow: "hidden" }}
            >
              {headlineWords.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden mr-4" style={{ verticalAlign: "top" }}>
                  <span className="word inline-block" style={{
                    color: w === "University" || w === "Entrance" ? "#7B1113" : "#1c1c17",
                  }}>
                    {w}
                  </span>
                </span>
              ))}
            </h1>

            <p
              ref={heroSubRef}
              className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-xl"
              style={{ opacity: 0 }}
            >
              A comprehensive, Brilliant-inspired UPCAT review platform covering all four
              subjects — with adaptive learning, real-time analytics, and content that
              actually makes you understand.
            </p>

            <div ref={heroCtaRef} className="flex flex-wrap gap-4">
              <Link
                href="/onboarding"
                className="text-white font-bold px-8 py-4 rounded-xl text-base flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg,#570005,#7B1113)", opacity: 0 }}
              >
                Begin Your Review
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
              <a
                href="#features"
                className="text-on-surface-variant font-semibold px-6 py-4 rounded-xl text-sm flex items-center gap-2 border hover:bg-surface-container transition-all"
                style={{ borderColor: "rgba(223,191,188,0.5)", opacity: 0 }}
              >
                <span className="material-symbols-outlined text-lg">play_circle</span>
                See how it works
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["🧑‍🎓", "👩‍💻", "🧑‍🔬", "👩‍📚"].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-surface-container-high border-2 flex items-center justify-center text-sm"
                    style={{ borderColor: "#fcf9f1" }}>
                    {e}
                  </div>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant">
                <span className="font-bold text-on-surface">2,400+</span> students reviewing right now
              </p>
            </div>
          </div>

          {/* Right — Floating UI */}
          <div ref={heroCardsRef} className="relative h-[580px] hidden lg:block">
            {/* Main lesson card */}
            <div className="hero-card absolute top-0 left-6 w-72 bg-white rounded-[1.5rem] shadow-2xl p-5"
              style={{ border: "1px solid rgba(223,191,188,0.15)", opacity: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#570005,#7B1113)" }}>
                  <span className="material-symbols-outlined text-white filled" style={{ fontSize: 18 }}>calculate</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Mathematics</p>
                  <p className="text-[10px] text-on-surface-variant">Chapter 1 · Arithmetic</p>
                </div>
              </div>
              {["Addition Properties", "Multiplication", "PEMDAS"].map((t, i) => (
                <div key={t} className="flex items-center gap-2.5 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i < 2 ? "" : "border-2"}`}
                    style={i < 2 ? { background: "linear-gradient(135deg,#570005,#7B1113)" } : { borderColor: "#dfbfbc" }}>
                    {i < 2 && <span className="material-symbols-outlined text-white filled" style={{ fontSize: 12 }}>check</span>}
                  </div>
                  <span className={`text-xs font-medium ${i < 2 ? "text-on-surface-variant line-through opacity-60" : "text-on-surface"}`}>{t}</span>
                </div>
              ))}
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(223,191,188,0.2)" }}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Progress</span>
                  <span className="text-xs font-bold text-[#7B1113]">67%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full w-2/3 rounded-full" style={{ background: "linear-gradient(90deg,#570005,#7B1113)" }} />
                </div>
              </div>
            </div>

            {/* Streak card */}
            <div className="hero-card absolute top-6 right-0 w-48 bg-white rounded-2xl shadow-xl p-4"
              style={{ border: "1px solid rgba(223,191,188,0.15)", opacity: 0 }}>
              <div className="text-2xl mb-1">🔥</div>
              <p className="text-2xl font-black text-on-surface">7</p>
              <p className="text-xs font-bold text-on-surface-variant">Day Streak</p>
              <p className="text-[10px] font-semibold mt-1" style={{ color: "#066c4e" }}>Personal best!</p>
            </div>

            {/* Quiz score card */}
            <div className="hero-card absolute top-[210px] right-4 w-64 bg-white rounded-2xl shadow-xl p-4"
              style={{ border: "1px solid rgba(223,191,188,0.15)", opacity: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(159,244,206,0.3)" }}>
                  <span className="material-symbols-outlined filled" style={{ color: "#066c4e", fontSize: 16 }}>quiz</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Quiz Complete!</p>
                  <p className="text-[10px] text-on-surface-variant">Cell Biology · 5 questions</p>
                </div>
              </div>
              <div className="text-3xl font-black" style={{ color: "#066c4e" }}>85%</div>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Great work! +170 XP earned</p>
            </div>

            {/* Weekly bar chart */}
            <div className="hero-card absolute bottom-20 left-0 w-56 bg-white rounded-2xl shadow-xl p-4"
              style={{ border: "1px solid rgba(223,191,188,0.15)", opacity: 0 }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">This Week</p>
              <div className="flex items-end gap-1.5 h-14">
                {[40, 65, 55, 80, 70, 90, 60].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm"
                    style={{ height: `${h}%`, background: "linear-gradient(180deg,#570005,#7B1113)", opacity: 0.7 + i * 0.04 }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <span key={i} className="text-[8px] text-on-surface-variant font-medium flex-1 text-center">{d}</span>
                ))}
              </div>
            </div>

            {/* XP card */}
            <div className="hero-card absolute bottom-0 right-8 w-52 rounded-2xl p-4"
              style={{ background: "linear-gradient(135deg,#570005,#7B1113)", opacity: 0 }}>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,218,214,0.7)" }}>Total XP</span>
                <span className="text-[10px] font-bold" style={{ color: "rgba(255,218,214,0.7)" }}>Lv. 4</span>
              </div>
              <p className="text-2xl font-black" style={{ color: "#ffdad6" }}>1,840</p>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,218,214,0.2)" }}>
                <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: "#ffdad6" }} />
              </div>
              <p className="text-[9px] mt-1" style={{ color: "rgba(255,218,214,0.6)" }}>660 XP to Level 5</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div ref={marqueeRef} className="overflow-hidden py-5 skew-on-scroll"
        style={{ backgroundColor: "#1c1c17" }}>
        <div className="marquee-track flex gap-12 whitespace-nowrap" style={{ width: "200%" }}>
          {Array(2).fill([
            "Mathematics", "Science", "Language Proficiency", "Reading Comprehension",
            "UPCAT 2025", "Mock Exams", "Analytics Dashboard", "Adaptive Learning",
            "XP System", "Streak Tracker", "All Question Types", "Brilliant-Style Lessons",
          ]).flat().map((t, i) => (
            <span key={i} className="text-sm font-bold uppercase tracking-widest"
              style={{ color: i % 3 === 0 ? "#ffb3ac" : "rgba(255,255,255,0.4)" }}>
              {t} <span style={{ color: "rgba(255,255,255,0.15)" }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section ref={statsRef} id="features" className="py-24"
        style={{ backgroundColor: "#f6f4eb" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Study Materials", target: 84, suffix: "+", icon: "library_books" },
              { label: "Practice Questions", target: 1200, suffix: "+", icon: "quiz" },
              { label: "Mock Exams", target: 12, suffix: "", icon: "assignment" },
              { label: "Subjects Covered", target: 4, suffix: "", icon: "school" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card bg-white rounded-2xl p-6"
                style={{ border: "1px solid rgba(223,191,188,0.2)", clipPath: "inset(0 100% 0 0)", opacity: 0 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg,#570005,#7B1113)" }}>
                  <span className="material-symbols-outlined text-white filled" style={{ fontSize: 20 }}>{stat.icon}</span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="stat-count text-3xl font-black text-on-surface"
                    data-target={stat.target} data-suffix={stat.suffix}>0</span>
                </div>
                <p className="text-xs font-medium text-on-surface-variant mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features-detail" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#7B1113" }}>
              Why UPCAT Hub
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight -tracking-tight">
              Built different.<br />
              <span className="text-on-surface-variant font-light">Designed to actually work.</span>
            </h2>
          </div>
          <div ref={featuresRef} className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "psychology", title: "Adaptive Learning Paths", desc: "Your dashboard personalizes itself based on weak subjects, daily goals, and progress.", color: "#7F77DD", bg: "rgba(127,119,221,0.08)" },
              { icon: "insights", title: "Insane Visual Analytics", desc: "Heatmaps, radar charts, streaks, XP systems — see exactly where you need work.", color: "#1D9E75", bg: "rgba(29,158,117,0.08)" },
              { icon: "quiz", title: "5 Question Types", desc: "MCQ, T/F, fill-in-blank, drag-and-drop matching, and ordering. Real UPCAT variety.", color: "#D85A30", bg: "rgba(216,90,48,0.08)" },
              { icon: "local_fire_department", title: "Streak & XP System", desc: "Study daily, build streaks, earn XP, level up. Gamification that actually motivates.", color: "#BA7517", bg: "rgba(186,117,23,0.08)" },
              { icon: "menu_book", title: "Rich Content Types", desc: "Text, embedded videos, images, PDFs — lessons that teach, not just test.", color: "#570005", bg: "rgba(87,0,5,0.08)" },
              { icon: "timer", title: "Timed Mock Exams", desc: "Full-length timed practice tests that simulate real UPCAT conditions.", color: "#066c4e", bg: "rgba(6,108,78,0.08)" },
            ].map((f) => (
              <div key={f.title} className="feature-card bg-white rounded-2xl p-6"
                style={{ border: "1px solid rgba(223,191,188,0.2)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: f.bg }}>
                  <span className="material-symbols-outlined filled text-2xl" style={{ color: f.color }}>{f.icon}</span>
                </div>
                <h3 className="font-bold text-on-surface text-base mb-2">{f.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section ref={subjectsRef} id="subjects" className="py-24"
        style={{ backgroundColor: "#f6f4eb" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-on-surface -tracking-tight">
              All four UPCAT subjects. <span className="text-on-surface-variant font-light">Fully covered.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { id: "math", label: "Mathematics", icon: "calculate", color: "#7F77DD", bg: "rgba(127,119,221,0.08)", desc: "Arithmetic → Algebra → Geometry → Trigonometry → Statistics" },
              { id: "science", label: "Science", icon: "science", color: "#1D9E75", bg: "rgba(29,158,117,0.08)", desc: "Biology → Chemistry → Physics → Earth Science" },
              { id: "language", label: "Language Proficiency", icon: "translate", color: "#D85A30", bg: "rgba(216,90,48,0.08)", desc: "Grammar → Vocabulary → Sentence Completion → Error Detection" },
              { id: "reading", label: "Reading Comprehension", icon: "menu_book", color: "#BA7517", bg: "rgba(186,117,23,0.08)", desc: "Main Idea → Inference → Tone & Purpose → Critical Analysis" },
            ].map((s) => (
              <div key={s.id} className="subj-card bg-white rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer"
                style={{ border: "1px solid rgba(223,191,188,0.2)", clipPath: "inset(0 100% 0 0)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: s.bg }}>
                  <span className="material-symbols-outlined filled text-3xl" style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-on-surface text-base mb-1">{s.label}</h3>
                  <p className="text-xs text-on-surface-variant">{s.desc}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-[2rem] p-16 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #570005 0%, #7B1113 100%)" }}>
            <div className="cta-bg-circle-1 absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", transform: "translate(33%,-33%)" }} />
            <div className="cta-bg-circle-2 absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", transform: "translate(-33%,33%)" }} />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "rgba(255,218,214,0.7)" }}>
                Ready to start?
              </p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6" style={{ color: "#ffdad6" }}>
                Your UP dream is closer<br />than you think.
              </h2>
              <p className="text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,218,214,0.7)" }}>
                Join thousands of students reviewing smarter. Free, comprehensive, and built specifically for the UPCAT.
              </p>
              <Link href="/onboarding"
                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-base hover:opacity-90 transition-opacity shadow-2xl"
                style={{ backgroundColor: "#ffdad6", color: "#570005" }}>
                Start Reviewing — It&apos;s Free
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12" style={{ borderTop: "1px solid rgba(223,191,188,0.2)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[#7B1113] font-black text-xl tracking-tighter">UPCAT Hub</span>
          <p className="text-xs text-on-surface-variant text-center">
            Built for aspiring UP students. Not affiliated with the University of the Philippines.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a key={item} href="#" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
