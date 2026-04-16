"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { subjects } from "@/lib/data/content";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "image" | "article" | "formula-sheet" | "cheatsheet";
  subject: string;
  topic: string;
  tags: string[];
  size?: string;
  duration?: string;
  url?: string;
}

const resources: Resource[] = [
  // Math
  { id: "r1", title: "PEMDAS Quick Reference", description: "One-page formula sheet covering all order of operations rules with examples.", type: "cheatsheet", subject: "math", topic: "Arithmetic", tags: ["pemdas", "operations", "formulas"], size: "1 page" },
  { id: "r2", title: "Algebra Formulas Master Sheet", description: "Complete collection of algebraic identities, equations, and factoring rules.", type: "formula-sheet", subject: "math", topic: "Algebra", tags: ["algebra", "formulas", "identities"], size: "3 pages" },
  { id: "r3", title: "Geometry Theorems PDF", description: "All key geometry theorems tested in UPCAT — angles, triangles, circles, and polygons.", type: "pdf", subject: "math", topic: "Geometry", tags: ["geometry", "theorems", "shapes"], size: "8 pages" },
  { id: "r4", title: "Word Problems Strategy Guide", description: "Step-by-step framework for solving any math word problem on the UPCAT.", type: "article", subject: "math", topic: "Problem Solving", tags: ["word-problems", "strategy", "tips"] },
  { id: "r5", title: "Trigonometry Values Table", description: "SOH-CAH-TOA, unit circle values, and trig identities in one compact table.", type: "cheatsheet", subject: "math", topic: "Trigonometry", tags: ["trig", "sohcahtoa", "formulas"], size: "1 page" },
  // Science
  { id: "r6", title: "Cell Biology Diagram Pack", description: "Labeled diagrams of prokaryotic and eukaryotic cells, cell division, and organelle functions.", type: "image", subject: "science", topic: "Biology", tags: ["cells", "biology", "diagrams"] },
  { id: "r7", title: "Periodic Table (Interactive)", description: "Full periodic table with element properties, electron configurations, and UPCAT-relevant info.", type: "pdf", subject: "science", topic: "Chemistry", tags: ["periodic-table", "chemistry", "elements"], size: "2 pages" },
  { id: "r8", title: "Physics Formulas Sheet", description: "All UPCAT-relevant physics formulas: kinematics, forces, energy, thermodynamics.", type: "formula-sheet", subject: "science", topic: "Physics", tags: ["physics", "formulas", "equations"], size: "4 pages" },
  { id: "r9", title: "Scientific Method Overview", description: "The steps of the scientific method with examples of each phase.", type: "article", subject: "science", topic: "General Science", tags: ["scientific-method", "research", "biology"] },
  { id: "r10", title: "DNA & Genetics Explained", description: "Video walkthrough of DNA replication, transcription, translation, and Mendelian genetics.", type: "video", subject: "science", topic: "Biology", tags: ["dna", "genetics", "biology"], duration: "18 min" },
  // Language
  { id: "r11", title: "Common Grammar Errors", description: "The 20 most common grammar mistakes Filipino students make on the UPCAT — and how to fix them.", type: "article", subject: "language", topic: "Grammar", tags: ["grammar", "errors", "tips"] },
  { id: "r12", title: "Vocabulary Word List", description: "500 high-frequency UPCAT vocabulary words with definitions and usage examples.", type: "pdf", subject: "language", topic: "Vocabulary", tags: ["vocabulary", "words", "definitions"], size: "12 pages" },
  { id: "r13", title: "Subject-Verb Agreement Rules", description: "Cheatsheet of all SVA rules including tricky cases: collective nouns, inverted sentences, correlatives.", type: "cheatsheet", subject: "language", topic: "Grammar", tags: ["grammar", "subject-verb", "rules"], size: "2 pages" },
  { id: "r14", title: "Sentence Completion Strategies", description: "Tested strategies for UPCAT sentence completion items — context clues, elimination, and patterns.", type: "article", subject: "language", topic: "Test Strategies", tags: ["sentence-completion", "strategy", "tips"] },
  // Reading
  { id: "r15", title: "Reading Comprehension Strategies", description: "The proven UPCAT reading approach: skimming, scanning, and active reading techniques.", type: "article", subject: "reading", topic: "Strategies", tags: ["strategy", "reading", "tips"] },
  { id: "r16", title: "Inference Question Guide", description: "How to approach inference questions: what they test, common traps, and how to eliminate wrong choices.", type: "pdf", subject: "reading", topic: "Inference", tags: ["inference", "critical-reading", "guide"], size: "5 pages" },
  { id: "r17", title: "Main Idea vs Topic Worksheet", description: "Practice exercises distinguishing topic from main idea with answer key.", type: "pdf", subject: "reading", topic: "Main Idea", tags: ["main-idea", "topic", "practice"], size: "3 pages" },
  { id: "r18", title: "Author's Purpose & Tone Guide", description: "How to identify author's purpose, tone, and attitude in UPCAT reading passages.", type: "cheatsheet", subject: "reading", topic: "Critical Reading", tags: ["tone", "purpose", "author"], size: "1 page" },
];

const typeConfig: Record<Resource["type"], { icon: string; label: string; color: string; bg: string }> = {
  pdf: { icon: "picture_as_pdf", label: "PDF", color: "#ba1a1a", bg: "rgba(186,26,26,0.1)" },
  video: { icon: "play_circle", label: "Video", color: "#066c4e", bg: "rgba(6,108,78,0.1)" },
  image: { icon: "image", label: "Image", color: "#7F77DD", bg: "rgba(127,119,221,0.1)" },
  article: { icon: "article", label: "Article", color: "#BA7517", bg: "rgba(186,117,23,0.1)" },
  "formula-sheet": { icon: "calculate", label: "Formula Sheet", color: "#570005", bg: "rgba(87,0,5,0.1)" },
  cheatsheet: { icon: "receipt_long", label: "Cheat Sheet", color: "#D85A30", bg: "rgba(216,90,48,0.1)" },
};

export default function ArchivePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchSubject = activeSubject === "all" || r.subject === activeSubject;
      const matchType = activeType === "all" || r.type === activeType;
      const matchSearch =
        search.trim() === "" ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some((t) => t.includes(search.toLowerCase()));
      return matchSubject && matchType && matchSearch;
    });
  }, [search, activeSubject, activeType]);

  const subjectOptions = [
    { id: "all", label: "All Subjects", icon: "apps", color: "#570005", bg: "rgba(87,0,5,0.1)" },
    ...subjects.map((s) => ({ id: s.id, label: s.title.split(" ")[0], icon: s.icon, color: s.color, bg: s.bgColor })),
  ];

  const typeOptions = ["all", ...Object.keys(typeConfig)];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Archive</p>
          <h1 className="font-display text-4xl font-black text-on-surface leading-tight mb-3">
            The knowledge vault.<br />
            <span className="text-on-surface-variant font-light italic">Everything, searchable.</span>
          </h1>
          <p className="text-on-surface-variant text-sm max-w-xl">
            Cheat sheets, formula references, video links, and practice materials — all in one place.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources, topics, tags..."
            className="w-full bg-surface-container-highest pl-12 pr-5 py-4 rounded-2xl text-on-surface placeholder:text-on-surface-variant/40 font-medium focus:outline-none focus:ring-2 focus:ring-primary-container text-sm border-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </motion.div>

        {/* Subject filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {subjectOptions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSubject(s.id)}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeSubject === s.id
                  ? "text-white border-transparent shadow-ambient-md"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
              style={activeSubject === s.id ? { background: `linear-gradient(135deg, ${s.color}99, ${s.color})` } : {}}
            >
              <span className="material-symbols-outlined filled" style={{ fontSize: 14 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Type filter + view toggle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {typeOptions.map((t) => {
              const cfg = t !== "all" ? typeConfig[t as Resource["type"]] : null;
              return (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                    activeType === t
                      ? "border-primary-container text-primary-container bg-primary-fixed/20"
                      : "border-transparent bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cfg && <span className="material-symbols-outlined filled" style={{ fontSize: 12, color: activeType === t ? "#7B1113" : cfg.color }}>{cfg.icon}</span>}
                  {t === "all" ? "All Types" : cfg?.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-2 rounded-lg transition-all ${viewMode === mode ? "editorial-gradient shadow-ambient-md" : "hover:bg-surface-container-high"}`}
              >
                <span className={`material-symbols-outlined text-lg ${viewMode === mode ? "text-white" : "text-on-surface-variant"}`}>
                  {mode === "grid" ? "grid_view" : "view_list"}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-xs font-bold text-on-surface-variant mb-5 uppercase tracking-widest">
          {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Resources */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-surface-container rounded-2xl border border-outline-variant/10"
            >
              <span className="text-5xl">🔍</span>
              <h3 className="font-bold text-on-surface text-lg mt-4 mb-2">Nothing found</h3>
              <p className="text-sm text-on-surface-variant">Try different search terms or filters.</p>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((resource, i) => (
                <ResourceCard key={resource.id} resource={resource} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {filtered.map((resource, i) => (
                <ResourceRow key={resource.id} resource={resource} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const type = typeConfig[resource.type];
  const subject = subjects.find((s) => s.id === resource.subject);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-ambient card-hover overflow-hidden group"
    >
      {/* Color strip */}
      <div className="h-1 w-full" style={{ backgroundColor: subject?.color || "#888" }} />

      <div className="p-5">
        {/* Type badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: type.bg }}>
              <span className="material-symbols-outlined filled" style={{ color: type.color, fontSize: 18 }}>{type.icon}</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: type.color }}>{type.label}</span>
          </div>
          {resource.size && (
            <span className="text-[9px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              {resource.size}
            </span>
          )}
          {resource.duration && (
            <span className="text-[9px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              {resource.duration}
            </span>
          )}
        </div>

        <h3 className="font-bold text-on-surface text-sm mb-2 group-hover:text-primary-container transition-colors leading-snug">
          {resource.title}
        </h3>
        <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4">{resource.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] font-bold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: subject?.color }}>
            {resource.topic}
          </span>
          <button className="text-[10px] font-bold text-primary-container flex items-center gap-1 hover:underline">
            {resource.type === "video" ? "Watch" : resource.type === "article" ? "Read" : "Download"}
            <span className="material-symbols-outlined text-sm">
              {resource.type === "video" ? "play_circle" : resource.type === "article" ? "open_in_new" : "download"}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ResourceRow({ resource, index }: { resource: Resource; index: number }) {
  const type = typeConfig[resource.type];
  const subject = subjects.find((s) => s.id === resource.subject);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-ambient card-hover p-4 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: type.bg }}>
        <span className="material-symbols-outlined filled" style={{ color: type.color, fontSize: 20 }}>{type.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: subject?.color }}>{resource.topic}</span>
          <span className="text-[9px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full" style={{ color: type.color }}>{type.label}</span>
        </div>
        <p className="text-sm font-bold text-on-surface truncate">{resource.title}</p>
        <p className="text-[11px] text-on-surface-variant truncate">{resource.description}</p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-3">
        {(resource.size || resource.duration) && (
          <span className="text-[10px] text-on-surface-variant hidden sm:block">{resource.size || resource.duration}</span>
        )}
        <button className="text-[10px] font-bold text-primary-container flex items-center gap-1 hover:underline whitespace-nowrap">
          {resource.type === "video" ? "Watch" : resource.type === "article" ? "Read" : "Download"}
          <span className="material-symbols-outlined text-sm">
            {resource.type === "video" ? "play_circle" : resource.type === "article" ? "open_in_new" : "download"}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
