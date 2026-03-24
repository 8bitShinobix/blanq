"use client";

import { useState } from "react";
import { ImageIcon, SmileIcon, MessageSquareIcon } from "lucide-react";
import { IconPicker } from "./icon-picker";
import { CoverPicker, type CoverValue } from "./cover-picker";
import { useCustomizationStore } from "@/stores/customization-store";

interface EditorTitleProps {
  title: string;
  onTitleChange: (title: string) => void;
  showCoverOptions?: boolean;
  icon?: string | null;
  hasCover?: boolean;
  onIconChange?: (emoji: string | null) => void;
  onCoverChange?: (cover: CoverValue | null) => void;
  onEnter?: () => void;
}

export function EditorTitle({
  title,
  onTitleChange,
  showCoverOptions = true,
  icon,
  hasCover = false,
  onIconChange,
  onCoverChange,
  onEnter,
}: EditorTitleProps) {
  const custom = useCustomizationStore((s) => s.state);
  const [isHovered, setIsHovered] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  const hasIcon = !!icon;
  const showButtons = isHovered || iconPickerOpen || coverPickerOpen;

  return (
    <div className="relative">
      {/* Icon display — overlaps cover when present */}
      {hasIcon && (
        <div className={hasCover ? "-mt-8" : ""}>
          <IconPicker
            open={iconPickerOpen}
            onOpenChange={setIconPickerOpen}
            onSelect={(emoji) => onIconChange?.(emoji)}
            onRemove={() => onIconChange?.(null)}
            hasIcon
          >
            <button
              className="mb-2 transition-transform hover:scale-110 focus:outline-none"
              style={{ fontSize: `${custom.logoWidth}px`, lineHeight: 1 }}
            >
              {icon}
            </button>
          </IconPicker>
        </div>
      )}

      {/* Hover action buttons — Notion style */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showCoverOptions && (
          <div
            className={`flex items-center gap-1 mb-2 transition-opacity duration-200 ${
              showButtons ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {!hasIcon && (
              <IconPicker
                open={iconPickerOpen}
                onOpenChange={setIconPickerOpen}
                onSelect={(emoji) => onIconChange?.(emoji)}
              >
                <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted">
                  <SmileIcon className="h-4 w-4" strokeWidth={1.5} />
                  Add icon
                </button>
              </IconPicker>
            )}
            {!hasCover && (
              <CoverPicker
                open={coverPickerOpen}
                onOpenChange={setCoverPickerOpen}
                onSelect={(c) => onCoverChange?.(c)}
              >
                <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted">
                  <ImageIcon className="h-4 w-4" strokeWidth={1.5} />
                  Add cover
                </button>
              </CoverPicker>
            )}
            <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted">
              <MessageSquareIcon className="h-4 w-4" strokeWidth={1.5} />
              Add comment
            </button>
          </div>
        )}

        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter?.();
            }
          }}
          placeholder="Form title"
          className="w-full border-none bg-transparent font-display text-4xl font-light tracking-tight text-[var(--editor-text,inherit)] placeholder:text-[var(--editor-placeholder)] focus:outline-none"
        />
      </div>
    </div>
  );
}
