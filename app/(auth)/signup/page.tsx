import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { GoogleOAuthButton } from "@/components/auth/oauth-buttons";
import { BlanqLogoLockup } from "@/components/icons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blanq-white px-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex justify-center">
          <BlanqLogoLockup size={36} variant="dark" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-light tracking-tight text-blanq-black">
            Create your account
          </h1>
          <p className="font-body text-sm text-grey-500">
            Start building beautiful forms in minutes
          </p>
        </div>

        <GoogleOAuthButton />

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-grey-200" />
          <span className="text-xs text-grey-400 font-body uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-grey-200" />
        </div>

        <SignupForm />

        <p className="text-center text-sm text-grey-500 font-body">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-accent-dark font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
