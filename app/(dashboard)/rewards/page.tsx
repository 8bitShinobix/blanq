import type { Metadata } from "next";
import { RewardsPage } from "@/components/rewards/rewards-page";
import type { Referral } from "@/components/rewards/referral-history";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Invite friends and earn rewards with Blanq's referral program.",
};

const MOCK_REFERRALS: Referral[] = [
  {
    id: "r1",
    email: "sarah@example.com",
    status: "subscribed",
    reward: 30.0,
    date: "2026-01-15",
  },
  {
    id: "r2",
    email: "mike@designstudio.co",
    status: "subscribed",
    reward: 30.0,
    date: "2026-02-03",
  },
  {
    id: "r3",
    email: "alex@startup.io",
    status: "signed_up",
    reward: null,
    date: "2026-02-18",
  },
  {
    id: "r4",
    email: "jamie@company.com",
    status: "pending",
    reward: null,
    date: "2026-02-28",
  },
  {
    id: "r5",
    email: "chris@freelance.dev",
    status: "expired",
    reward: null,
    date: "2025-11-10",
  },
];

export default function RewardsRoute() {
  return (
    <RewardsPage
      inviteLink="https://blanq.app/invite/durgesh-abc123"
      headline="Give 20% off. Earn up to $150."
      description="Invite your friends to Blanq and give them 20% off for 3 months on any plan. You'll earn 20% of their subscription cost, up to $150 per referral."
      stats={{
        totalReferrals: 5,
        successfulReferrals: 2,
        totalEarned: 60.0,
      }}
      referrals={MOCK_REFERRALS}
    />
  );
}
