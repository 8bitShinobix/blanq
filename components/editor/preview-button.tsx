"use client";

import { Button } from "@/components/ui/button";
import { useFormContentStore } from "@/stores/form-content-store";

export function PreviewButton() {
  const setPreviewing = useFormContentStore((s) => s.setPreviewing);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground"
      onClick={() => setPreviewing(true)}
    >
      Preview
    </Button>
  );
}
