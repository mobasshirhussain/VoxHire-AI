import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-10 px-4 gap-8">

      {/* Page Header */}
      <div className="w-full flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-widest text-[#63b3ed] bg-[#63b3ed]/[0.08] border border-[#63b3ed]/20 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#63b3ed] animate-pulse" />
          New Session
        </div>

        <h1
          className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight text-[#f0f4ff] leading-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Interview Generation
        </h1>

        <p className="text-sm text-[#8a96b0] max-w-md">
          Your AI interviewer will craft a personalized set of questions based on your role and experience. Just start the call and speak naturally.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Agent */}
      <Agent
        userName={user?.name!}
        userId={user?.id}
        profileImage={user?.profileURL}
        type="generate"
      />
    </div>
  );
};

export default Page;