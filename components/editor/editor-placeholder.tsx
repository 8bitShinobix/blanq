"use client";

import {
  FileText,
  LayoutGrid,
  Send,
  HelpCircle,
  BookOpen,
  Code,
  Zap,
  Settings,
  AtSign,
  DollarSign,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

interface EditorPlaceholderProps {
  onStart: () => void;
}

export function EditorPlaceholder({ onStart }: EditorPlaceholderProps) {
  return (
    <div className="mt-8">
      {/* Quick start options */}
      <div className="space-y-1">
        <button
          onClick={onStart}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          <FileText className="h-4 w-4" strokeWidth={1.5} />
          Press Enter to start from scratch
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
          <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
          Use a template
        </button>
      </div>

      {/* Description */}
      <div className="mt-10 space-y-1 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          Blanq is a form builder that{" "}
          <span className="rounded bg-pink-100 px-1.5 py-0.5 text-pink-600">
            works like a doc
          </span>
          .
        </p>
        <p>
          Just type{" "}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
            /
          </kbd>{" "}
          to insert form blocks and{" "}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
            @
          </kbd>{" "}
          to mention question answers.
        </p>
      </div>

      {/* Help columns */}
      <div className="mt-10 grid grid-cols-2 gap-12">
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Get started
          </h3>
          <div className="space-y-0.5">
            <HelpLink icon={Send} label="Create your first form" />
            <HelpLink icon={LayoutGrid} label="Get started with templates" />
            <HelpLink icon={Code} label="Embed your form" />
            <HelpLink icon={HelpCircle} label="Help center" />
            <HelpLink icon={Zap} label="Learn about Blanq Pro" />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground">
            How-to guides
          </h3>
          <div className="space-y-0.5">
            <HelpLink icon={SlidersHorizontal} label="Conditional logic" />
            <HelpLink icon={Eye} label="Calculator" />
            <HelpLink icon={BookOpen} label="Hidden fields" />
            <HelpLink icon={AtSign} label="Mentions" />
            <HelpLink icon={DollarSign} label="Collect payments" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpLink({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
      {label}
    </button>
  );
}
