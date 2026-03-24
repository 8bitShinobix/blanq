import { Separator } from "@/components/ui/separator";

interface RewardsStatsProps {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarned: number;
}

export function RewardsStats({ totalReferrals, successfulReferrals, totalEarned }: RewardsStatsProps) {
  const stats = [
    { label: "Invited", value: totalReferrals.toString() },
    { label: "Converted", value: successfulReferrals.toString() },
    { label: "Earned", value: `$${totalEarned.toFixed(0)}` },
  ];

  return (
    <div className="flex items-center justify-around rounded-lg border border-grey-200/60 bg-grey-100/30 py-5">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center">
          {i > 0 && <Separator orientation="vertical" className="mr-8 h-8" />}
          <div className="text-center">
            <p className="font-display text-2xl font-semibold tabular-nums">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
