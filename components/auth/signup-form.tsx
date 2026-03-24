"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = signupSchema.safeParse({ name, email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    const { error: authError } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (authError) {
      setError(authError.message ?? "Could not create account");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-grey-600 mb-2 font-body">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          required
          className="w-full px-4 py-3 rounded-xl border border-grey-200 bg-blanq-white text-blanq-black font-body text-base placeholder:text-grey-400 transition-colors duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/30"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-grey-600 mb-2 font-body">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="w-full px-4 py-3 rounded-xl border border-grey-200 bg-blanq-white text-blanq-black font-body text-base placeholder:text-grey-400 transition-colors duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/30"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-grey-600 mb-2 font-body">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          className="w-full px-4 py-3 rounded-xl border border-grey-200 bg-blanq-white text-blanq-black font-body text-base placeholder:text-grey-400 transition-colors duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/30"
        />
      </div>

      {error && (
        <p className="text-sm text-error font-body">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-xl bg-accent text-white font-body text-base font-medium transition-all duration-200 hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
