import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;

  const badgeStyles: Record<string, string> = {
    Behavioral: "text-[#68d391] bg-[#68d391]/10 border-[#68d391]/20",
    Mixed:      "text-[#f6ad55] bg-[#f6ad55]/10 border-[#f6ad55]/20",
    Technical:  "text-[#63b3ed] bg-[#63b3ed]/10 border-[#63b3ed]/20",
  };
  const badgeClass = badgeStyles[normalizedType] ?? badgeStyles.Mixed;

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto py-10 px-4">

      {/* ── Header ── */}
      <div className="relative flex flex-col gap-5 px-7 py-6 rounded-[20px] bg-[#0f1219] border border-white/[0.06] overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#63b3ed]/50 to-transparent" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Role + tech stack */}
          <div className="flex flex-wrap items-center gap-4">
            <h1
              className="text-[clamp(1.3rem,2.5vw,1.75rem)] font-extrabold text-[#f0f4ff] capitalize tracking-tight leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {interview.role} Interview
            </h1>
            <DisplayTechIcons techStack={interview.techstack} />
          </div>

          {/* Type badge */}
          <span
            className={`text-[0.7rem] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border ${badgeClass}`}
          >
            {normalizedType}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-[0.78rem] text-[#505870]">
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {interview.questions?.length ?? 0} questions
          </div>

          {feedback && (
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f6ad55">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-[#f0f4ff] font-semibold">{feedback.totalScore}</span>
              <span>/100 on previous attempt</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${feedback ? "bg-[#68d391]" : "bg-[#505870]"}`}
            />
            {feedback ? "Previously attempted" : "Not attempted yet"}
          </div>
        </div>
      </div>

      {/* ── Agent ── */}
      <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      />
    </div>
  );
};

export default InterviewDetails;