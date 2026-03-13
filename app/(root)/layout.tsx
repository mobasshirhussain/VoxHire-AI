import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f0f4ff]">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[#090b10]/85 backdrop-blur-xl border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1a4a7a] to-[#0f2a4a] border border-[#63b3ed]/35">
            <Image src="/logo.svg" alt="VoxHire Logo" width={25} height={25} />
          </div>
          <span
            className="text-[1.2rem] font-bold text-[#f0f4ff] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            VoxHire
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#68d391]/[0.12] border border-[#68d391]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#68d391] animate-pulse" />
          <span className="text-[0.72rem] font-semibold text-[#68d391] tracking-widest uppercase">
            Live Practice
          </span>
        </div>
      </nav>

      <main className="flex-1 px-6 md:px-12 pb-20">{children}</main>
    </div>
  );
};

export default Layout;