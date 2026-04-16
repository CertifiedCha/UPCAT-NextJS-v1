"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { subjects } from "@/lib/data/content";
import { useStore } from "@/lib/store";
import type { Subject } from "@/lib/store";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { completeLesson, setLessonProgress, recordStudySession, progress } = useStore();

  const subjectId = params.subject as string;
  const chapterId = params.chapter as string;
  const lessonId = params.lesson as string;

  const subject = subjects.find((s) => s.id === subjectId);
  const chapter = subject?.chapters.find((c) => c.id === chapterId);
  const lesson = chapter?.lessons.find((l) => l.id === lessonId);

  const [readProgress, setReadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (progress.completedLessons.includes(lessonId)) {
      setReadProgress(100);
      setIsComplete(true);
    }
  }, [lessonId, progress.completedLessons]);

  // Simulate reading progress as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollEl = document.documentElement;
      const scrolled = scrollEl.scrollTop;
      const total = scrollEl.scrollHeight - scrollEl.clientHeight;
      if (total > 0) {
        const pct = Math.round((scrolled / total) * 100);
        setReadProgress(Math.max(readProgress, pct));
        setLessonProgress(lessonId, Math.max(readProgress, pct));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lessonId, readProgress, setLessonProgress]);

  if (!subject || !chapter || !lesson) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Lesson not found.</p>
        </div>
      </AppLayout>
    );
  }

  const handleComplete = () => {
    const minutesSpent = Math.round((Date.now() - startTime) / 60000);
    completeLesson(lessonId);
    recordStudySession(Math.max(minutesSpent, 1), subjectId as Subject);
    setIsComplete(true);
    setReadProgress(100);
  };

  // Find next lesson
  const allLessons = chapter.lessons;
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = allLessons[currentIdx + 1];
  const nextChapter = !nextLesson ? subject.chapters[subject.chapters.indexOf(chapter) + 1] : null;

  return (
    <AppLayout>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:left-64 h-0.5 bg-surface-container-high">
        <motion.div
          className="h-full"
          style={{ backgroundColor: subject.color }}
          animate={{ width: `${readProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-8 flex-wrap">
          <button onClick={() => router.push("/materials")} className="hover:text-on-surface transition-colors">
            Materials
          </button>
          <span>›</span>
          <button onClick={() => router.push(`/materials/${subject.id}`)} className="hover:text-on-surface transition-colors">
            {subject.title}
          </button>
          <span>›</span>
          <span className="font-semibold text-on-surface">{lesson.title}</span>
        </div>

        {/* Lesson header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ color: subject.color, backgroundColor: subject.bgColor }}
            >
              {subject.title}
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant">{chapter.title}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-on-surface leading-tight mb-2">
            {lesson.title}
          </h1>
          {lesson.subtitle && (
            <p className="text-on-surface-variant text-base">{lesson.subtitle}</p>
          )}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>
                schedule
              </span>
              <span className="text-xs text-on-surface-variant font-medium">{lesson.duration} min read</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined filled text-secondary" style={{ fontSize: 16 }}>
                bolt
              </span>
              <span className="text-xs font-bold text-secondary">+{lesson.xp} XP on completion</span>
            </div>
            {isComplete && (
              <span className="flex items-center gap-1 text-xs font-bold text-secondary">
                <span className="material-symbols-outlined filled text-secondary" style={{ fontSize: 16 }}>
                  check_circle
                </span>
                Completed
              </span>
            )}
          </div>
        </motion.div>

        {/* Content blocks */}
        <div className="space-y-10">
          {lesson.content.map((block, blockIdx) => (
            <motion.div
              key={blockIdx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: blockIdx * 0.15 }}
            >
              {block.type === "text" && <TextBlock data={block.data as TextBlockData} subjectColor={subject.color} />}
              {block.type === "image" && <ImageBlock data={block.data as ImageBlockData} />}
              {block.type === "video" && <VideoBlock data={block.data as VideoBlockData} />}
              {block.type === "pdf" && <PDFBlock data={block.data as PDFBlockData} />}
            </motion.div>
          ))}
        </div>

        {/* Completion section */}
        <div className="mt-16 pt-10 border-t border-outline-variant/20">
          {!isComplete ? (
            <div className="text-center">
              <p className="text-on-surface-variant text-sm mb-6">
                Finished reading? Mark this lesson complete to earn your XP.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className="editorial-gradient text-white font-bold px-8 py-4 rounded-2xl text-base shadow-ambient-lg flex items-center gap-2 mx-auto"
              >
                <span className="material-symbols-outlined filled text-xl">check_circle</span>
                Complete Lesson · Earn {lesson.xp} XP
              </motion.button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="font-display text-2xl font-black text-on-surface mb-2">
                  Lesson Complete!
                </h3>
                <p className="text-on-surface-variant text-sm mb-8">
                  You earned <span className="font-bold text-secondary">+{lesson.xp} XP</span>. Keep going!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {lesson.quizId && (
                    <button
                      onClick={() => router.push(`/quiz/${lesson.quizId}`)}
                      className="editorial-gradient text-white font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient-md"
                    >
                      <span className="material-symbols-outlined filled text-lg">quiz</span>
                      Take the Quiz
                    </button>
                  )}

                  {nextLesson && (
                    <button
                      onClick={() => router.push(`/materials/${subject.id}/${chapter.id}/${nextLesson.id}`)}
                      className="bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient card-hover"
                    >
                      Next: {nextLesson.title}
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  )}

                  {!nextLesson && nextChapter && (
                    <button
                      onClick={() => router.push(`/materials/${subject.id}/${nextChapter.id}/${nextChapter.lessons[0].id}`)}
                      className="bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-ambient card-hover"
                    >
                      Next Chapter
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  )}

                  <button
                    onClick={() => router.push(`/materials/${subject.id}`)}
                    className="text-on-surface-variant font-semibold text-sm hover:text-on-surface transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">menu_book</span>
                    Back to {subject.title}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// ─────────────────────────────────────────────────────────
// Content Block Components
// ─────────────────────────────────────────────────────────

interface Section {
  title: string;
  body: string;
  formula?: string;
}

interface TextBlockData {
  heading?: string;
  body?: string;
  sections?: Section[];
}

function TextBlock({ data, subjectColor }: { data: TextBlockData; subjectColor: string }) {
  return (
    <div className="prose-like space-y-6">
      {data.heading && (
        <h2 className="font-display text-2xl font-black text-on-surface border-l-4 pl-4" style={{ borderColor: subjectColor }}>
          {data.heading}
        </h2>
      )}
      {data.body && (
        <p className="text-on-surface-variant text-base leading-relaxed">{data.body}</p>
      )}
      {data.sections?.map((section: Section, i: number) => (
        <div key={i} className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <h3 className="font-bold text-on-surface text-base mb-3 flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ backgroundColor: subjectColor }}
            >
              {i + 1}
            </span>
            {section.title}
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">{section.body}</p>
          {section.formula && (
            <div
              className="mt-4 p-4 rounded-xl font-mono text-center text-base font-bold"
              style={{ backgroundColor: subjectColor + "15", color: subjectColor }}
            >
              {section.formula}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface ImageBlockData {
  src?: string;
  alt?: string;
  caption?: string;
}

function ImageBlock({ data }: { data: ImageBlockData }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-outline-variant/10 shadow-ambient">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.src || "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80"}
        alt={data.alt || ""}
        className="w-full object-cover max-h-80"
      />
      {data.caption && (
        <div className="bg-surface-container-low px-4 py-2.5">
          <p className="text-xs text-on-surface-variant text-center">{data.caption}</p>
        </div>
      )}
    </div>
  );
}

interface VideoBlockData {
  url?: string;
  title?: string;
  duration?: string;
}

function VideoBlock({ data }: { data: VideoBlockData }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-outline-variant/10 shadow-ambient bg-surface-container-low">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-outline-variant/10">
        <span className="material-symbols-outlined filled text-primary-container text-xl">play_circle</span>
        <div>
          <p className="text-sm font-bold text-on-surface">{data.title || "Video Lesson"}</p>
          {data.duration && (
            <p className="text-xs text-on-surface-variant">{data.duration}</p>
          )}
        </div>
      </div>
      {data.url ? (
        <div className="aspect-video">
          <iframe
            src={data.url}
            title={data.title || "Video"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video bg-surface-container flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl filled">play_circle</span>
            <p className="text-sm text-on-surface-variant mt-2">Video content coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface PDFBlockData {
  url?: string;
  title?: string;
  pages?: number;
}

function PDFBlock({ data }: { data: PDFBlockData }) {
  return (
    <div className="rounded-2xl border border-outline-variant/10 shadow-ambient bg-surface-container-low p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-error-container rounded-xl flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined filled text-on-error-container text-2xl">picture_as_pdf</span>
      </div>
      <div className="flex-1">
        <p className="font-bold text-on-surface text-sm">{data.title || "Reference PDF"}</p>
        {data.pages && (
          <p className="text-xs text-on-surface-variant">{data.pages} pages</p>
        )}
      </div>
      <button className="text-xs font-bold text-primary-container flex items-center gap-1 hover:underline">
        <span className="material-symbols-outlined text-base">download</span>
        Download
      </button>
    </div>
  );
}
