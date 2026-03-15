import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({ interviewId, userId })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeStyles: Record<string, string> = {
    Behavioral: "text-[#68d391] bg-[#68d391]/10 border-[#68d391]/20",
    Mixed:      "text-[#f6ad55] bg-[#f6ad55]/10 border-[#f6ad55]/20",
    Technical:  "text-[#63b3ed] bg-[#63b3ed]/10 border-[#63b3ed]/20",
  };
  const badgeClass = badgeStyles[normalizedType] ?? badgeStyles.Mixed;

  const accentColor: Record<string, string> = {
    Behavioral: "via-[#68d391]",
    Mixed:      "via-[#f6ad55]",
    Technical:  "via-[#63b3ed]",
  };
  const accentClass = accentColor[normalizedType] ?? accentColor.Mixed;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const hasFeedback = !!feedback;

  return (
    <div className="group relative flex flex-col gap-5 p-6 rounded-[20px] bg-[#0f1219] border border-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden">

      {/* Hover top accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          accentClass
        )}
      />

      {/* Top row — type badge + date */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-[0.68rem] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border",
            badgeClass
          )}
        >
          {normalizedType}
        </span>

        <div className="flex items-center gap-1.5 text-[0.75rem] text-[#505870]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {formattedDate}
        </div>
      </div>

      {/* Role */}
      <h3
        className="text-[1.05rem] font-bold text-[#f0f4ff] capitalize tracking-tight leading-snug"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {role} Interview
      </h3>

      {/* Score row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#161b26] border border-white/[0.06]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#f6ad55">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-[0.78rem] font-semibold text-[#f0f4ff]">
            {feedback?.totalScore ?? "—"}<span className="text-[#505870] font-normal">/100</span>
          </span>
        </div>

        {hasFeedback && (
          <span className="text-[0.68rem] text-[#68d391] bg-[#68d391]/10 border border-[#68d391]/20 px-2.5 py-1 rounded-full font-medium">
            Completed
          </span>
        )}
      </div>

      {/* Assessment snippet */}
      <p className="text-sm leading-relaxed text-[#8a96b0] line-clamp-2 flex-1">
        {feedback?.finalAssessment ||
          "You haven't taken this interview yet. Take it now to improve your skills."}
      </p>

      {/* Divider */}
      <div className="h-px bg-white/[0.05]" />

      {/* Footer — tech icons + CTA */}
      <div className="flex items-center justify-between gap-3">
        <DisplayTechIcons techStack={techstack} />

        <Link
          href={
            hasFeedback
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}`
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[0.78rem] font-semibold text-[#040810] transition-all duration-200 hover:brightness-110 hover:shadow-[0_4px_16px_rgba(99,179,237,0.3)] whitespace-nowrap"
          style={{
            fontFamily: "'Syne', sans-serif",
            background: "linear-gradient(135deg, #63b3ed 0%, #4a9fd4 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          {hasFeedback ? "View Feedback" : "Start Interview"}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;