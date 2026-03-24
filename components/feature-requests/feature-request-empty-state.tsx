import { MessageSquarePlus } from "lucide-react";

export function FeatureRequestEmptyState({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-grey-200 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-grey-100">
        <MessageSquarePlus className="size-6 text-grey-400" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 font-display text-base font-medium text-blanq-black">
        {hasFilters ? "No matching requests" : "No feature requests yet"}
      </h3>
      <p className="mt-1.5 max-w-xs text-sm text-grey-400">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Be the first to suggest a feature and help shape the future of Blanq."}
      </p>
    </div>
  );
}
