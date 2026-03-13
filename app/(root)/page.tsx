import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-20 max-w-6xl mx-auto pt-4">
      <section className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-8 mt-8 px-8 md:px-14 py-14 md:py-20 rounded-[28px] bg-[#0f1219] border border-white/[0.06] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 25% 50%, rgba(99,179,237,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(99,179,237,0.05) 0%, transparent 60%)",
          }}
        />
      
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 30% 50%, black, transparent)",
          }}
        />

        
        <div className="relative z-10 flex flex-col gap-6 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[0.72rem] font-semibold uppercase tracking-widest text-[#90cdf4] bg-[#63b3ed]/[0.08] border border-[#63b3ed]/20 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63b3ed] animate-pulse" />
            AI-Powered Interview Coach
          </div>

        
          <h1
            className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#f0f4ff]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Ace Every Interview
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #90cdf4 0%, #a8d8f0 100%)",
              }}
            >
              Before It Happens.
            </span>
          </h1>

          <p className="text-base leading-relaxed text-[#8a96b0] max-w-[420px]">
            Simulate real interviews, receive instant AI feedback, and sharpen
            your answers — at any hour, on any role.
          </p>

          <div className="flex items-center gap-5 flex-wrap">
            <Button asChild className="p-0 bg-transparent border-none shadow-none hover:bg-transparent">
              <Link href="/interview">
                <span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] text-[0.9rem] font-bold text-[#040810] transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    background: "linear-gradient(135deg, #63b3ed 0%, #4a9fd4 100%)",
                    boxShadow:
                      "0 4px 24px rgba(99,179,237,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  Start Practicing
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </Button>
            <span className="text-[0.8rem] italic text-[#505870]">
              No setup needed — just talk
            </span>
          </div>
        </div>

        
        <div className="relative z-10 hidden md:block">
          <div className="relative rounded-[20px] overflow-hidden">
            <Image
              src="/robot1.png"
              alt="AI Interview Assistant"
              width={340}
              height={340}
              className="block"
              style={{ filter: "drop-shadow(0 20px 60px rgba(99,179,237,0.15))" }}
              priority
            />
            
            <div
              className="absolute inset-[-1px] rounded-[20px] pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,179,237,0.2), transparent 60%)",
              }}
            />
          </div>
        </div>
      </section>

      
      <InterviewSection
        label="History"
        title="Your Interviews"
        count={userInterviews?.length}
        isEmpty={!hasPastInterviews}
        emptyIcon="🎤"
        emptyTitle="No interviews yet"
        emptySub="Your completed sessions will appear here."
      >
        {hasPastInterviews &&
          userInterviews?.map((interview) => (
            <InterviewCard
              key={interview.id}
              userId={user?.id}
              interviewId={interview.id}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
            />
          ))}
      </InterviewSection>

      <InterviewSection
        label="Explore"
        title="Take Interviews"
        count={allInterview?.length}
        isEmpty={!hasUpcomingInterviews}
        emptyIcon="📋"
        emptyTitle="No interviews available"
        emptySub="Check back soon — new sessions are added regularly."
      >
        {hasUpcomingInterviews &&
          allInterview?.map((interview) => (
            <InterviewCard
              key={interview.id}
              userId={user?.id}
              interviewId={interview.id}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
            />
          ))}
      </InterviewSection>
    </div>
  );
}


function InterviewSection({
  label,
  title,
  count,
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptySub,
  children,
}: {
  label: string;
  title: string;
  count?: number;
  isEmpty: boolean;
  emptyIcon: string;
  emptyTitle: string;
  emptySub: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-7">

      <div className="flex items-center gap-4 pb-5 border-b border-white/[0.06]">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#63b3ed] bg-[#63b3ed]/[0.08] border border-[#63b3ed]/15 px-2.5 py-1 rounded-full">
          {label}
        </span>
        <h2
          className="text-[clamp(1.2rem,2vw,1.6rem)] font-bold tracking-tight text-[#f0f4ff]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h2>
        {!isEmpty && count != null && (
          <span className="ml-auto text-[0.8rem] font-semibold text-[#505870] bg-[#161b26] border border-white/[0.06] px-2.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isEmpty ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-14 px-8 rounded-[20px] bg-[#0f1219] border border-dashed border-white/10 text-center">
            <span className="text-4xl opacity-50">{emptyIcon}</span>
            <p
              className="text-base font-semibold text-[#8a96b0]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {emptyTitle}
            </p>
            <p className="text-sm text-[#505870] max-w-[280px]">{emptySub}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export default Home;