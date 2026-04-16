"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { subjects } from "@/lib/data/content";
import { useStore } from "@/lib/store";

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const { progress } = useStore();
  const subjectId = params.subject as string;
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Subject not found.</p>
        </div>
      </AppLayout>
    );
  }

  const allLessons = subject.chapters.flatMap((c) => c.lessons);
  const done = allLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
  const pct = Math.round((done / allLessons.length) * 100);

  return (
    <AppLayout>
      {/* Hero strip */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${subject.color}22 0%, ${subject.color}08 100%)` }}
      >
        <div className="max-w-4xl mx-auto px-6 py-10">
          <button
            onClick={() => router.push("/materials")}
            className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface mb-6 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            All subjects
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-6"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: subject.bgColor }}
            >
              <span
                className="material-symbols-outlined filled text-3xl"
                style={{ color: subject.color }}
              >
                {subject.icon}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-black text-on-surface mb-2">{subject.title}</h1>
              <p className="text-sm text-on-surface-variant mb-5">{subject.description}</p>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>
                    library_books
                  </span>
                  <span className="text-sm font-medium text-on-surface-variant">{allLessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>
                    quiz
                  </span>
                  <span className="text-sm font-medium text-on-surface-variant">{subject.totalQuizzes} quizzes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>
                    check_circle
                  </span>
                  <span className="text-sm font-medium text-on-surface-variant">{done}/{allLessons.length} complete</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-5 max-w-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Progress</span>
                  <span className="text-xs font-black" style={{ color: subject.color }}>{pct}%</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: subject.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chapters - Brilliant style linear path */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-8">
          {subject.chapters.map((chapter, chapterIdx) => {
            const chapterLessons = chapter.lessons;
            const chapterDone = chapterLessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            const chapterPct = Math.round((chapterDone / chapterLessons.length) * 100);
            const isUnlocked = chapterIdx === 0 || (() => {
              const prevChapter = subject.chapters[chapterIdx - 1];
              const prevDone = prevChapter.lessons.filter((l) =>
                progress.completedLessons.includes(l.id)
              ).length;
              return prevDone > 0; // unlock if any prev lesson done
            })();

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: chapterIdx * 0.1 }}
              >
                {/* Chapter header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isUnlocked
                        ? `linear-gradient(135deg, ${subject.color}33, ${subject.color}11)`
                        : undefined,
                      backgroundColor: !isUnlocked ? "#f0eee5" : undefined,
                    }}
                  >
                    <span
                      className="material-symbols-outlined filled"
                      style={{
                        color: isUnlocked ? subject.color : "#8b716e",
                        fontSize: 20,
                      }}
                    >
                      {isUnlocked ? chapter.icon : "lock"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2
                      className={`font-bold text-base ${isUnlocked ? "text-on-surface" : "text-on-surface-variant"}`}
                    >
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-on-surface-variant">{chapter.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black" style={{ color: subject.color }}>
                      {chapterPct}%
                    </span>
                    <p className="text-[10px] text-on-surface-variant">{chapterDone}/{chapterLessons.length}</p>
                  </div>
                </div>

                {/* Lesson list */}
                <div className="relative pl-5">
                  {/* Vertical line */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                    style={{
                      backgroundColor: subject.color,
                      opacity: isUnlocked ? 0.2 : 0.08,
                    }}
                  />

                  <div className="space-y-2">
                    {chapterLessons.map((lesson, lessonIdx) => {
                      const isDone = progress.completedLessons.includes(lesson.id);
                      const isLessonUnlocked =
                        isUnlocked &&
                        (lessonIdx === 0 ||
                          progress.completedLessons.includes(chapterLessons[lessonIdx - 1].id));

                      return (
                        <button
                          key={lesson.id}
                          disabled={!isLessonUnlocked}
                          onClick={() =>
                            isLessonUnlocked &&
                            router.push(`/materials/${subject.id}/${chapter.id}/${lesson.id}`)
                          }
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                            isDone
                              ? "bg-surface-container-low border-outline-variant/10"
                              : isLessonUnlocked
                              ? "bg-surface-container-lowest border-outline-variant/10 shadow-ambient card-hover"
                              : "bg-surface-container border-transparent opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {/* Status circle */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isDone
                                ? ""
                                : isLessonUnlocked
                                ? "border-2"
                                : "border-2 border-outline-variant/30"
                            }`}
                            style={
                              isDone
                                ? { background: subject.color }
                                : isLessonUnlocked
                                ? { borderColor: subject.color }
                                : {}
                            }
                          >
                            {isDone ? (
                              <span className="material-symbols-outlined text-white filled" style={{ fontSize: 16 }}>
                                check
                              </span>
                            ) : isLessonUnlocked ? (
                              <span className="text-xs font-black" style={{ color: subject.color }}>
                                {lessonIdx + 1}
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-on-surface-variant filled" style={{ fontSize: 14 }}>
                                lock
                              </span>
                            )}
                          </div>

                          {/* Lesson info */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${isDone ? "text-on-surface-variant line-through opacity-60" : "text-on-surface"}`}>
                              {lesson.title}
                            </p>
                            {lesson.subtitle && (
                              <p className="text-[10px] text-on-surface-variant mt-0.5">{lesson.subtitle}</p>
                            )}
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Content type indicators */}
                            <div className="flex items-center gap-1">
                              {lesson.content.map((c, i) => (
                                <span
                                  key={i}
                                  className="material-symbols-outlined text-on-surface-variant/50"
                                  style={{ fontSize: 14 }}
                                >
                                  {c.type === "video"
                                    ? "play_circle"
                                    : c.type === "image"
                                    ? "image"
                                    : c.type === "pdf"
                                    ? "picture_as_pdf"
                                    : "article"}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] font-medium text-on-surface-variant whitespace-nowrap">
                              {lesson.duration}m
                            </span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ color: subject.color, backgroundColor: subject.bgColor }}
                            >
                              +{lesson.xp} XP
                            </span>
                          </div>
                        </button>
                      );
                    })}

                    {/* Chapter quiz */}
                    {chapter.chapterQuizId && (
                      <button
                        onClick={() => router.push(`/quiz/${chapter.chapterQuizId}`)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed border-outline-variant/30 hover:border-primary-container/40 bg-primary-fixed/10 hover:bg-primary-fixed/20 transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-full editorial-gradient flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-white filled" style={{ fontSize: 16 }}>
                            quiz
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-primary-container">Chapter Quiz</p>
                          <p className="text-[10px] text-on-surface-variant">
                            Test your understanding of {chapter.title}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-primary-container group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
