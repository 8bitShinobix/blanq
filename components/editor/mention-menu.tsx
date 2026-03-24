"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { BLOCK_TYPES, QUESTION_BLOCK_TYPES, type Block } from "./types";
import { BLOCK_ICON_MAP as ICON_MAP } from "./icon-map";

interface MentionMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect: (blockId: string, label: string) => void;
  blocks: Block[];
  currentBlockId: string;
  search: string;
  activeIndex: number;
}

export function MentionMenu({
  open,
  onClose,
  onSelect,
  blocks,
  currentBlockId,
  search,
  activeIndex,
}: MentionMenuProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMentionItems(blocks, currentBlockId, search);

  // Scroll active item into view
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const el = container.querySelector(`[data-index="${activeIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <Popover open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <PopoverAnchor asChild>
        <span className="block h-0 w-0" />
      </PopoverAnchor>
      <PopoverContent
        className="w-[240px] p-0 shadow-lg rounded-lg border"
        align="start"
        side="bottom"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b">
          <span className="text-xs font-medium text-muted-foreground">
            Mention an input field
          </span>
        </div>

        {/* List */}
        <div ref={listRef} className="max-h-[240px] overflow-y-auto py-1">
          {filtered.length > 0 ? (
            filtered.map((block, index) => {
              const blockDef = BLOCK_TYPES.find((b) => b.type === block.type);
              const Icon = blockDef ? ICON_MAP[blockDef.icon] : null;
              const label = block.content || getBlockLabel(block.type);
              const isActive = activeIndex === index;
              return (
                <button
                  key={block.id}
                  data-index={index}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(block.id, label);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-white"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                      strokeWidth={1.5}
                    />
                  )}
                  <span className="truncate">{label}</span>
                </button>
              );
            })
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No input fields found.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Get the filtered items for keyboard navigation in the parent */
export function useMentionItems(
  blocks: Block[],
  currentBlockId: string,
  search: string
) {
  return useMemo(() => {
    const mentionable = blocks.filter(
      (b) => QUESTION_BLOCK_TYPES.has(b.type) && b.id !== currentBlockId
    );
    if (!search) return mentionable;
    const q = search.toLowerCase();
    return mentionable.filter((b) => {
      const label = b.content || getBlockLabel(b.type);
      return label.toLowerCase().includes(q);
    });
  }, [blocks, currentBlockId, search]);
}

export function getBlockLabel(type: string): string {
  const def = BLOCK_TYPES.find((b) => b.type === type);
  return def ? `Untitled ${def.label.toLowerCase()} field` : "Untitled field";
}
