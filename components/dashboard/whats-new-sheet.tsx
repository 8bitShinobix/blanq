"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";

interface WhatsNewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChangelogEntry {
  date: string;
  title: string;
}

const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: "March 3, 2026",
    title: "Show & hide pages with conditional logic",
  },
  {
    date: "February 20, 2026",
    title: "New form analytics dashboard",
  },
  {
    date: "February 10, 2026",
    title: "File upload improvements",
  },
  {
    date: "January 28, 2026",
    title: "Custom thank you pages",
  },
  {
    date: "January 15, 2026",
    title: "Improved form templates",
  },
];

export function WhatsNewSheet({ open, onOpenChange }: WhatsNewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 gap-0">
        <SheetHeader className="sr-only">
          <SheetTitle>What&apos;s new</SheetTitle>
          <SheetDescription>Latest updates and changelog</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <div className="px-8 py-8">
            {/* Branding */}
            <p className="text-xl font-bold">blanq*</p>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-bold">What&apos;s new</h2>

            {/* Promo card */}
            <div className="mt-6 rounded-lg border bg-muted/50 px-6 py-5">
              <p className="text-sm leading-relaxed">
                As a bootstrapped company, Blanq grows through word of mouth and
                the support of amazing customers like you. If you love using
                Blanq, the best way to support us is by leaving a quick review.
                It only takes a minute, and it makes a huge difference.
              </p>
              <a
                href="#"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:opacity-80"
              >
                Leave a review
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Changelog entries */}
            <div className="mt-10 space-y-10">
              {CHANGELOG_ENTRIES.map((entry) => (
                <div key={entry.title}>
                  <p className="text-sm text-muted-foreground">{entry.date}</p>
                  <h3 className="mt-1 text-xl font-semibold">{entry.title}</h3>
                  {/* Placeholder image area */}
                  <div className="mt-4 aspect-video rounded-lg border bg-muted/40" />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
