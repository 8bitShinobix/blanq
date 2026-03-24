"use client";

import { Send, UserCheck, DollarSign } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ReferralInvite } from "./referral-invite";
import { RewardsStats } from "./rewards-stats";
import { ReferralHistory, type Referral } from "./referral-history";

interface RewardsPageProps {
  inviteLink: string;
  headline: string;
  description: string;
  stats: {
    totalReferrals: number;
    successfulReferrals: number;
    totalEarned: number;
  };
  referrals: Referral[];
}

const STEPS = [
  {
    icon: Send,
    title: "Share your link",
    description: "Send your unique referral link to friends and colleagues.",
  },
  {
    icon: UserCheck,
    title: "They subscribe",
    description: "They get 20% off for 3 months on any paid plan.",
  },
  {
    icon: DollarSign,
    title: "You earn rewards",
    description: "Earn 20% of their subscription, up to $150 each.",
  },
];

export function RewardsPage({
  inviteLink,
  headline,
  description,
  stats,
  referrals,
}: RewardsPageProps) {
  return (
    <>
      {/* Dashboard header bar */}
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="font-display text-lg font-medium">Rewards</h1>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl px-6 py-10">
          {/* Hero */}
          <div className="text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {headline}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Invite link */}
          <div className="mt-8">
            <ReferralInvite inviteLink={inviteLink} />
          </div>

          {/* Stats */}
          <div className="mt-8">
            <RewardsStats {...stats} />
          </div>

          {/* How it works */}
          <div className="mt-10">
            <h3 className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              How it works
            </h3>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="text-center">
                    <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-grey-100">
                      <span className="text-xs font-medium text-muted-foreground">{i + 1}</span>
                    </div>
                    <p className="mt-3 text-sm font-medium">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* History */}
          <div className="mt-10">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Referral history
            </h3>
            <ReferralHistory referrals={referrals} />
          </div>
        </div>
      </div>
    </>
  );
}
