"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="px-6 py-3 rounded-xl border border-grey-200 font-body text-sm font-medium text-grey-600 transition-all duration-200 hover:bg-grey-100 hover:border-grey-300 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}
