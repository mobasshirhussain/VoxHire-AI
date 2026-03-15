import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const formattedDate = feedback?.createdAt
    ? dayjs(feedback.createdAt).format("MMM D, YYYY · h:mm A")
    : "N/A";

  const score = feedback?.totalScore ?? 0;
  const scoreColor =
    score >= 80
      ? "text-[#68d391]"
      : score >= 50
      ? "text-[#f6ad55]"
      : "text-[#fc8181]";

  const scoreBarColor =
    score >= 80
      ? "bg-[#68d391]"
      : score >= 50
      ? "bg-[#f6ad55]"
      : "bg-[#fc8181]";

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto py-10 px-4">

      {/* ── Header card ── */}
      <div className="relative flex flex-col gap-5 px-7 py-7 rounded-[20px] bg-[#0f1219] border border-white/[0.06] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#63b3ed]/50 to-transparent" />

        {/* Title */}
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#63b3ed] mb-2">
            Interview Feedback
          </p>
          <h1
            className="text-[clamp(1.4rem,3vw,1.9rem)] font-extrabold text-[#f0f4ff] capitalize tracking-tight leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {interview.role} Interview
          </h1>
        </div>

        {/* Score + date row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Score pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#161b26] border border-white/[0.06]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f6ad55">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-sm text-[#8a96b0]">Overall Score</span>
            <span className={`text-base font-bold ${scoreColor}`}>
              {feedback?.totalScore ?? "—"}
            </span>
            <span className="text-sm text-[#505870]">/100</span>
          </div>

          {/* Date pill */}
          <div className="flex items-center gap-1.5 text-[0.78rem] text-[#505870]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {formattedDate}
          </div>
        </div>
      </div>

      {/* ── Final Assessment ── */}
      <div className="px-7 py-6 rounded-[20px] bg-[#0f1219] border border-white/[0.06]">
        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#505870] mb-3">
          Final Assessment
        </p>
        <p className="text-sm leading-relaxed text-[#8a96b0]">
          {feedback?.finalAssessment ?? "No assessment available."}
        </p>
      </div>

      {/* ── Category Breakdown ── */}
      <div className="flex flex-col gap-4">
        <h2
          className="text-base font-bold text-[#f0f4ff] tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Score Breakdown
        </h2>

        <div className="flex flex-col gap-3">
          {feedback?.categoryScores?.map((category, index) => (
            <div
              key={index}
              className="flex flex-col gap-2.5 px-6 py-5 rounded-[16px] bg-[#0f1219] border border-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <p
                  className="text-sm font-semibold text-[#f0f4ff]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {index + 1}. {category.name}
                </p>
                <span
                  className={`text-sm font-bold ${
                    category.score >= 80
                      ? "text-[#68d391]"
                      : category.score >= 50
                      ? "text-[#f6ad55]"
                      : "text-[#fc8181]"
                  }`}
                >
                  {category.score}/100
                </span>
              </div>

              {/* Score bar */}
              <div className="h-1 w-full rounded-full bg-white/[0.05]">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    category.score >= 80
                      ? "bg-[#68d391]"
                      : category.score >= 50
                      ? "bg-[#f6ad55]"
                      : "bg-[#fc8181]"
                  }`}
                  style={{ width: `${category.score}%` }}
                />
              </div>

              <p className="text-sm text-[#8a96b0] leading-relaxed">
                {category.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Strengths + Areas ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Strengths */}
        <div className="flex flex-col gap-3 px-6 py-5 rounded-[16px] bg-[#0f1219] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#68d391]" />
            <h3
              className="text-sm font-bold text-[#f0f4ff]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Strengths
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#8a96b0]">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-[#68d391]/60 shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="flex flex-col gap-3 px-6 py-5 rounded-[16px] bg-[#0f1219] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f6ad55]" />
            <h3
              className="text-sm font-bold text-[#f0f4ff]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Areas for Improvement
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#8a96b0]">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f6ad55]/60 shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-sm font-semibold text-[#8a96b0] bg-[#0f1219] border border-white/[0.08] transition-all duration-200 hover:border-white/20 hover:text-[#f0f4ff]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </Link>

        <Link
          href={`/interview/${id}`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-sm font-bold text-[#040810] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
          style={{
            fontFamily: "'Syne', sans-serif",
            background: "linear-gradient(135deg, #63b3ed 0%, #4a9fd4 100%)",
            boxShadow: "0 4px 24px rgba(99,179,237,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
          </svg>
          Retake Interview
        </Link>
      </div>
    </div>
  );
};

export default Feedback;