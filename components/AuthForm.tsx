"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { auth } from "@/firebase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import { signIn, signUp } from "@/lib/actions/auth.action";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";


const AuthformSchema = (type: FormType) =>
  z.object({
    name:
      type === "sign-up"
        ? z.string().min(5, "Name must be at least 5 characters.")
        : z.string().optional(),
    email: z.email(),
    password: z.string().min(6),
  });

export default function AuthForm({ type }: { type: FormType }) {
  const router = useRouter();
  const isSignIn = type === "sign-in";
  const formSchema = AuthformSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

 const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }
        const response = await signIn({
          email,
          idToken,
        });

        if (response?.success === false) {
          toast.error(response.message);
          return;
        }

        toast.success("Signed in successfully.");
        
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  return (
    <div className="min-w-80 lg:min-w-120 flex items-center justify-center bg-[#090b10] px-4">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,179,237,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md rounded-[24px] bg-[#0f1219] border border-white/[0.07] shadow-2xl overflow-hidden">


        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#63b3ed]/60 to-transparent" />

        <div className="px-8 pt-10 pb-8 flex flex-col gap-7">


          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1a4a7a] to-[#0f2a4a] border border-[#63b3ed]/35">
                <Image src="/logo.svg" alt="VoxHire" width={20} height={20} />
              </div>
              <span
                className="text-xl font-bold text-[#f0f4ff] tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                VoxHire
              </span>
            </div>

            <div className="text-center">
              <h1
                className="text-[1.45rem] font-extrabold text-[#f0f4ff] tracking-tight leading-snug"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {isSignIn ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm text-[#8a96b0] mt-1">
                Practice job interviews with AI
              </p>
            </div>
          </div>


          <form
            id="auth-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {!isSignIn && (
              <FormField
                name="name"
                label="Name"
                placeholder="Your full name"
                control={form.control}
              />
            )}
            <FormField
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
              control={form.control}
            />
            <FormField
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
              control={form.control}
            />
          </form>


          <button
            type="submit"
            form="auth-form"
            className="w-full py-2.5 rounded-[14px] font-bold text-sm text-[#040810] tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: "linear-gradient(135deg, #63b3ed 0%, #4a9fd4 100%)",
              boxShadow:
                "0 4px 24px rgba(99,179,237,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>


          <p className="text-center text-sm text-[#505870]">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="ml-1.5 font-semibold text-[#63b3ed] hover:text-[#90cdf4] transition-colors"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}