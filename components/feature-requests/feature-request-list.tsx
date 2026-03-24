import {
  FeatureRequestCard,
  type FeatureRequestCardProps,
} from "./feature-request-card";
import { FeatureRequestEmptyState } from "./feature-request-empty-state";

interface FeatureRequestListProps {
  requests: Omit<FeatureRequestCardProps, "onVote">[];
  hasFilters: boolean;
  onVote?: (id: string) => Promise<void>;
}

export function FeatureRequestList({
  requests,
  hasFilters,
  onVote,
}: FeatureRequestListProps) {
  if (requests.length === 0) {
    return <FeatureRequestEmptyState hasFilters={hasFilters} />;
  }

  return (
    <div className="space-y-3">
      {requests.map((request, index) => (
        <div
          key={request.id}
          className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both"
          style={{
            animationDelay: `${index * 50}ms`,
            animationDuration: "300ms",
          }}
        >
          <FeatureRequestCard {...request} onVote={onVote} />
        </div>
      ))}
    </div>
  );
}
