"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Zap, ClipboardList, Share, GitBranch } from "lucide-react";
import { CustomizeSheet } from "./customize-sheet";
import { PreviewButton } from "./preview-button";
import { useFormContentStore } from "@/stores/form-content-store";

const ICON_BUTTONS = [
  { icon: Zap, label: "Integrations", hideOnMobile: true },
  { icon: ClipboardList, label: "Responses", hideOnMobile: true },
  { icon: Share, label: "Share", hideOnMobile: false },
] as const;

interface EditorToolbarProps {
  status?: "draft" | "live";
}

export function EditorToolbar({ status = "draft" }: EditorToolbarProps) {
  const setPublished = useFormContentStore((s) => s.setPublished);
  const toggleCanvasMode = useFormContentStore((s) => s.toggleCanvasMode);

  return (
    <TooltipProvider>
      <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
        {status === "live" ? (
          <Badge variant="outline" className="mr-1 gap-1.5 font-normal sm:mr-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live
          </Badge>
        ) : (
          <Badge variant="secondary" className="mr-1 font-normal text-muted-foreground sm:mr-2">
            Draft
          </Badge>
        )}
        <Separator orientation="vertical" className="mx-0.5 h-4 sm:mx-1" />
        {ICON_BUTTONS.map(({ icon: Icon, label, hideOnMobile }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className={`group ${hideOnMobile ? "hidden sm:inline-flex" : ""}`}
              >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-white" strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>{label}</TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="group hidden sm:inline-flex"
              onClick={toggleCanvasMode}
            >
              <GitBranch className="h-4 w-4 text-muted-foreground group-hover:text-white" strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={4}>Flow view</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-0.5 h-4 sm:mx-1" />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hidden md:inline-flex">
              <CustomizeSheet />
            </span>
          </TooltipTrigger>
          <TooltipContent sideOffset={4}>Customize theme</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hidden sm:inline-flex">
              <PreviewButton />
            </span>
          </TooltipTrigger>
          <TooltipContent sideOffset={4}>Preview form</TooltipContent>
        </Tooltip>
        <Button size="sm" onClick={() => setPublished(true)}>Publish</Button>
      </div>
    </TooltipProvider>
  );
}
