import { Gift } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Referral {
  id: string;
  email: string;
  status: "pending" | "signed_up" | "subscribed" | "expired";
  reward: number | null;
  date: string;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  pending: { label: "Pending", dot: "bg-amber-400", text: "text-amber-600" },
  signed_up: { label: "Signed up", dot: "bg-blue-400", text: "text-blue-600" },
  subscribed: { label: "Subscribed", dot: "bg-emerald-400", text: "text-emerald-600" },
  expired: { label: "Expired", dot: "bg-grey-300", text: "text-muted-foreground" },
};

interface ReferralHistoryProps {
  referrals: Referral[];
}

export function ReferralHistory({ referrals }: ReferralHistoryProps) {
  if (referrals.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <Gift className="mb-3 size-6 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No referrals yet</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Share your link to start earning.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Person</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reward</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.map((referral) => {
          const config = STATUS_CONFIG[referral.status] ?? STATUS_CONFIG.pending;

          return (
            <TableRow key={referral.id}>
              <TableCell className="text-sm">{referral.email}</TableCell>
              <TableCell>
                <span className="flex items-center gap-1.5">
                  <span className={cn("size-1.5 rounded-full", config.dot)} />
                  <span className={cn("text-xs", config.text)}>{config.label}</span>
                </span>
              </TableCell>
              <TableCell className="text-sm tabular-nums">
                {referral.reward != null ? `$${referral.reward.toFixed(0)}` : (
                  <span className="text-muted-foreground/40">&mdash;</span>
                )}
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {new Date(referral.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
