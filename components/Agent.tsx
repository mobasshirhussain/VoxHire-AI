"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          { role: message.role, content: message.transcript },
        ]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });
      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: { username: userName, userid: userId },
      });
    } else {
      const formattedQuestions = questions
        ? questions.map((q) => `- ${q}`).join("\n")
        : "";
      await vapi.start(interviewer, {
        variableValues: { questions: formattedQuestions },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const isConnecting = callStatus === CallStatus.CONNECTING;
  const isActive = callStatus === CallStatus.ACTIVE;

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-3xl mx-auto py-10 px-4">
      <div className="grid grid-cols-2 gap-5 w-full">


        <div className="relative flex flex-col items-center gap-4 p-10 rounded-[20px] bg-[#0f1219] border border-white/[0.06] overflow-hidden">

          <div
            className="absolute inset-0 pointer-events-none "
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,179,237,0.08) 0%, transparent 70%)",
            }}
          />


          <div className="relative flex items-center justify-center">
            <div
              className={cn(
                "absolute w-20 h-20 rounded-full border-2 transition-all duration-300",
                isSpeaking
                  ? "border-[#63b3ed]/60 scale-110 animate-pulse"
                  : "border-white/10"
              )}
            />

            {isSpeaking && (
              <span className="absolute w-24 h-24 rounded-full border border-[#63b3ed]/25 animate-ping" />
            )}
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#63b3ed]/30 bg-[#161b26]">
              {/* <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              /> */}
            </div>
          </div>

          <div className="relative text-center">
            <p
              className="text-base font-bold text-[#f0f4ff] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              AI Interviewer
            </p>
            <p className="text-[0.72rem] text-[#505870] mt-0.5">
              {isSpeaking ? (
                <span className="text-[#63b3ed]">Speaking…</span>
              ) : isActive ? (
                "Listening"
              ) : (
                "Standby"
              )}
            </p>
          </div>


          {isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#63b3ed] to-transparent" />
          )}
        </div>


        <div className="relative flex flex-col  items-center gap-4 p-10 rounded-[20px] bg-[#0f1219] border border-white/[0.06] overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(104,211,145,0.06) 0%, transparent 70%)",
            }}
          />

          {/* <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#68d391]/25 bg-[#161b26]">
            <Image
              src="/user-avatar.png"
              alt={userName}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div> */}

          <div className="relative pt-10 text-center">
            <p
              className="text-base font-bold text-[#f0f4ff] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {userName}
            </p>
            <p className="text-[0.72rem] text-[#505870] mt-0.5">You</p>
          </div>

          {isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#68d391] to-transparent" />
          )}
        </div>
      </div>


      {messages.length > 0 && (
        <div className="w-full rounded-[16px] bg-[#0f1219] border border-white/[0.06] p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63b3ed] animate-pulse" />
            <span className="text-[0.68rem] uppercase tracking-widest font-semibold text-[#505870]">
              Live Transcript
            </span>
          </div>
          <p
            key={lastMessage}
            className="text-sm leading-relaxed text-[#8a96b0] animate-fadeIn"
          >
            {lastMessage}
          </p>

          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f1219] to-transparent pointer-events-none" />
        </div>
      )}


      <div className="flex justify-center w-full mt-2">
        {!isActive ? (
          <button
            onClick={handleCall}
            disabled={isConnecting}
            className={cn(
              "relative inline-flex items-center gap-2.5 px-10 py-4 rounded-[14px] font-bold text-sm tracking-wide transition-all duration-200",
              "text-[#040810]",
              isConnecting
                ? "opacity-80 cursor-not-allowed"
                : "hover:-translate-y-0.5 active:translate-y-0"
            )}
            style={{
              fontFamily: "'Syne', sans-serif",
              background: isConnecting
                ? "linear-gradient(135deg, #4a9fd4 0%, #3a8fc4 100%)"
                : "linear-gradient(135deg, #63b3ed 0%, #4a9fd4 100%)",
              boxShadow: isConnecting
                ? "0 2px 12px rgba(99,179,237,0.2)"
                : "0 4px 24px rgba(99,179,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >

            {isConnecting && (
              <span className="absolute inset-0 rounded-[14px] border border-[#63b3ed]/40 animate-ping" />
            )}

            <span>
              {isConnecting ? "Connecting…" : "Start Interview"}
            </span>
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="relative inline-flex items-center gap-2.5 px-10 py-4 rounded-[14px] font-bold text-sm tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
              boxShadow:
                "0 4px 24px rgba(229,62,62,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            End Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;