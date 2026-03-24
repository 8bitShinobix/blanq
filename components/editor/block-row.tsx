"use client";

import { useRef, useState, useCallback, useEffect, type KeyboardEvent } from "react";
import {
  GripVertical,
  Plus,
  ImageIcon,
  Film,
  Volume2,
  Globe,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BLOCK_TYPES, type Block, type BlockType } from "./types";
import { SlashCommandMenu } from "./slash-command-menu";
import { MentionMenu, useMentionItems, getBlockLabel } from "./mention-menu";
import { BlockPreview } from "./block-preview";
import { EmbedDialog } from "./embed-dialog";
import {
  ConditionalLogicCard,
  RecaptchaCard,
  RespondentsCountryCard,
} from "./advanced-block-cards";
import { BlockOptionsPopover } from "./block-options-popover";

// Block types that render as question fields with label + preview
const QUESTION_TYPES = new Set<string>([
  "short_answer",
  "long_answer",
  "multiple_choice",
  "checkboxes",
  "dropdown",
  "multi_select",
  "number",
  "email",
  "phone",
  "link",
  "file_upload",
  "date",
  "time",
  "linear_scale",
  "matrix",
  "rating",
  "payment",
  "signature",
  "ranking",
  "wallet_connect",
]);

// Embed block types — render as action cards
const EMBED_TYPES: Record<string, { icon: React.ElementType; label: string }> = {
  image: { icon: ImageIcon, label: "Add an image" },
  video: { icon: Film, label: "Embed a video" },
  audio: { icon: Volume2, label: "Embed an audio file" },
  embed: { icon: Globe, label: "Embed anything" },
};

// Layout block types with editable text inputs — each has distinct styling
const LAYOUT_INPUT_STYLES: Record<string, { className: string; placeholder: string }> = {
  heading_1: {
    className: "text-3xl font-bold",
    placeholder: "Heading 1",
  },
  heading_2: {
    className: "text-2xl font-semibold",
    placeholder: "Heading 2",
  },
  heading_3: {
    className: "text-xl font-semibold",
    placeholder: "Heading 3",
  },
  title: {
    className: "text-4xl font-bold",
    placeholder: "Title",
  },
  label: {
    className: "text-sm font-medium text-[var(--editor-placeholder)]",
    placeholder: "Label",
  },
};

// Layout blocks that render as non-editable visual dividers
const LAYOUT_DIVIDER_TYPES = new Set<string>(["divider", "new_page", "thank_you_page"]);

// Advanced block types — render as self-contained cards
const ADVANCED_TYPES = new Set<string>([
  "conditional_logic",
  "recaptcha",
  "respondents_country",
]);

// ── Mention highlight overlay ────────────────────────────────────

function buildMentionSegments(
  content: string,
  mentions?: Array<{ displayText: string; blockId: string }>
): Array<{ text: string; isMention: boolean }> {
  if (!mentions?.length) return [{ text: content, isMention: false }];
  const segments: Array<{ text: string; isMention: boolean }> = [];
  let cursor = 0;
  for (const m of mentions) {
    const idx = content.indexOf(m.displayText, cursor);
    if (idx === -1) continue;
    if (idx > cursor) segments.push({ text: content.slice(cursor, idx), isMention: false });
    segments.push({ text: m.displayText, isMention: true });
    cursor = idx + m.displayText.length;
  }
  if (cursor < content.length) segments.push({ text: content.slice(cursor), isMention: false });
  return segments;
}

function MentionOverlay({
  content,
  mentions,
  className,
}: {
  content: string;
  mentions?: Array<{ displayText: string; blockId: string }>;
  className: string;
}) {
  if (!mentions?.length) return null;
  const segments = buildMentionSegments(content, mentions);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden whitespace-pre ${className}`} aria-hidden="true">
      {segments.map((seg, i) =>
        seg.isMention ? (
          <span key={i} className="bg-primary/15 rounded-sm">{seg.text}</span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </div>
  );
}

interface BlockRowProps {
  block: Block;
  allBlocks?: Block[];
  onUpdate: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
  onAddBelow: (id: string) => void;
  onDuplicate: (id: string) => void;
  onEnter: (id: string) => void;
  onBackspace: (id: string) => void;
  onFocus?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function BlockRow({
  block,
  allBlocks,
  onUpdate,
  onDelete,
  onAddBelow,
  onDuplicate,
  onEnter,
  onBackspace,
  onFocus,
  inputRef: externalRef,
}: BlockRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashInsertMode, setSlashInsertMode] = useState(false);
  const [mentionMenuOpen, setMentionMenuOpen] = useState(false);
  const [mentionInsertIndex, setMentionInsertIndex] = useState(0);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = externalRef || internalRef;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const sortableStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Close options popover when drag starts
  useEffect(() => {
    if (isDragging) setOptionsOpen(false);
  }, [isDragging]);

  const isQuestion = QUESTION_TYPES.has(block.type);
  const isEmbed = block.type in EMBED_TYPES;
  const isLayoutInput = block.type in LAYOUT_INPUT_STYLES;
  const isLayoutDivider = LAYOUT_DIVIDER_TYPES.has(block.type);
  const isAdvanced = ADVANCED_TYPES.has(block.type);
  const blockLabel =
    block.type === "text"
      ? null
      : BLOCK_TYPES.find((b) => b.type === block.type)?.label;

  // Question blocks always show their label; text/layout blocks only when focused
  const placeholder = isQuestion
    ? blockLabel || "Type your question..."
    : isFocused
      ? block.type === "text"
        ? "Type '/' to insert blocks"
        : blockLabel || "Type here..."
      : "";

  // Compute the mention search text from current content
  const mentionSearch = mentionMenuOpen
    ? block.content.slice(mentionInsertIndex + 1, ref.current?.selectionStart ?? block.content.length)
    : "";

  const mentionFiltered = useMentionItems(allBlocks || [], block.id, mentionSearch);
  const [mentionActiveIndex, setMentionActiveIndex] = useState(0);

  // Reset mention active index on search change
  useEffect(() => {
    setMentionActiveIndex(0);
  }, [mentionSearch]);

  const handleMentionSelect = useCallback(
    (blockId: string, label: string) => {
      const displayText = `@${label}`;
      const before = block.content.slice(0, mentionInsertIndex);
      const cursorPos = ref.current?.selectionStart ?? block.content.length;
      const after = block.content.slice(cursorPos);
      const newContent = before + displayText + " " + after;
      const newMentions = [...(block.mentions || []), { displayText, blockId }];
      onUpdate(block.id, { content: newContent, mentions: newMentions });
      setMentionMenuOpen(false);
      setTimeout(() => {
        const input = ref.current;
        if (input) {
          input.focus();
          const pos = before.length + displayText.length + 1;
          input.setSelectionRange(pos, pos);
        }
      }, 0);
    },
    [block.id, block.content, block.mentions, mentionInsertIndex, onUpdate, ref]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      // Mention menu keyboard navigation
      if (mentionMenuOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setMentionActiveIndex((i) => Math.min(i + 1, mentionFiltered.length - 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setMentionActiveIndex((i) => Math.max(i - 1, 0));
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (mentionFiltered[mentionActiveIndex]) {
            const b = mentionFiltered[mentionActiveIndex];
            handleMentionSelect(b.id, b.content || getBlockLabel(b.type));
          }
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setMentionMenuOpen(false);
          return;
        }
      }

      if (e.key === "Enter" && !slashMenuOpen && !mentionMenuOpen) {
        e.preventDefault();
        onEnter(block.id);
      }

      if (e.key === "Backspace" && block.content === "") {
        e.preventDefault();
        if (block.type !== "text") {
          onUpdate(block.id, { type: "text" });
        } else {
          onBackspace(block.id);
        }
      }
    },
    [block.id, block.content, block.type, onEnter, onBackspace, onUpdate, slashMenuOpen, mentionMenuOpen, mentionFiltered, mentionActiveIndex, handleMentionSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value === "/") {
        setSlashMenuOpen(true);
        onUpdate(block.id, { content: "" });
        return;
      }

      // Detect @ typed: compare with previous content
      const cursorPos = e.target.selectionStart ?? value.length;
      if (value.length > block.content.length) {
        const newChar = value[cursorPos - 1];
        if (newChar === "@") {
          setMentionInsertIndex(cursorPos - 1);
          setMentionMenuOpen(true);
        }
      }

      // Close mention menu on space or if @ is deleted
      if (mentionMenuOpen) {
        const textAfterAt = value.slice(mentionInsertIndex);
        if (!textAfterAt.startsWith("@")) {
          setMentionMenuOpen(false);
        }
      }

      onUpdate(block.id, { content: value });
    },
    [block.id, block.content.length, onUpdate, mentionMenuOpen, mentionInsertIndex]
  );

  const handleSlashSelect = useCallback(
    (type: BlockType) => {
      setSlashMenuOpen(false);
      // '+' mode keeps content, '/' mode clears it
      const updates: Partial<Block> = slashInsertMode
        ? { type }
        : { type, content: "" };
      if (type === "conditional_logic") {
        updates.conditions = [{ field: "", operator: "is", value: "" }];
        updates.actions = [{ type: "show_blocks", targetBlocks: [] }];
      }
      setSlashInsertMode(false);
      onUpdate(block.id, updates);
      if (type in EMBED_TYPES) {
        setEmbedDialogOpen(true);
      } else {
        setTimeout(() => ref.current?.focus(), 0);
      }
    },
    [block.id, onUpdate, ref, slashInsertMode]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className={`group relative flex items-start py-1 ${isDragging ? "z-50 opacity-80 shadow-lg rounded-lg bg-background" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left controls — visible on hover only */}
      <div
        className={`absolute right-full flex items-center gap-0.5 pr-2 transition-opacity duration-100 ${
          isEmbed || isAdvanced ? "top-3" : "top-1.5"
        } ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={() => { setSlashInsertMode(true); setSlashMenuOpen(true); }}
          className="rounded p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
          title="Add block below"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
        <BlockOptionsPopover
          block={block}
          open={optionsOpen}
          onOpenChange={setOptionsOpen}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        >
          <button
            className="cursor-grab rounded p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
            title="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" strokeWidth={2} />
          </button>
        </BlockOptionsPopover>
      </div>

      {/* Block content */}
      <SlashCommandMenu
        open={slashMenuOpen}
        onClose={() => { setSlashMenuOpen(false); setSlashInsertMode(false); }}
        onSelect={handleSlashSelect}
      >
        <div className={`flex-1 ${block.hidden ? "opacity-50" : ""}`}>
          {/* Mention menu — inline anchor + portal popover */}
          <MentionMenu
            open={mentionMenuOpen}
            onClose={() => setMentionMenuOpen(false)}
            onSelect={handleMentionSelect}
            blocks={allBlocks || []}
            currentBlockId={block.id}
            search={mentionSearch}
            activeIndex={mentionActiveIndex}
          />
          {isEmbed ? (
            /* Embed block — action card with icon + label */
            (() => {
              const embedInfo = EMBED_TYPES[block.type];
              const EmbedIcon = embedInfo.icon;
              return (
                <div>
                  {/* Hidden input for keyboard handling (backspace to revert, Enter to add below) */}
                  <input
                    ref={ref}
                    type="text"
                    value=""
                    onChange={() => {}}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="sr-only"
                    tabIndex={-1}
                  />
                  <button
                    onClick={() => setEmbedDialogOpen(true)}
                    className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3.5 text-base text-muted-foreground shadow-sm transition-colors hover:bg-muted/70"
                  >
                    <EmbedIcon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                    {embedInfo.label}
                  </button>
                  <EmbedDialog
                    type={block.type}
                    open={embedDialogOpen}
                    onOpenChange={setEmbedDialogOpen}
                  />
                </div>
              );
            })()
          ) : isAdvanced ? (
            /* Advanced block — self-contained card */
            <div>
              <input
                ref={ref}
                type="text"
                value=""
                onChange={() => {}}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="sr-only"
                tabIndex={-1}
              />
              {block.type === "conditional_logic" ? (
                <ConditionalLogicCard
                  block={block}
                  allBlocks={allBlocks || []}
                  onUpdate={onUpdate}
                />
              ) : block.type === "recaptcha" ? (
                <RecaptchaCard />
              ) : block.type === "respondents_country" ? (
                <RespondentsCountryCard />
              ) : (
                <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3.5 text-base text-muted-foreground shadow-sm">
                  {blockLabel}
                </div>
              )}
            </div>
          ) : isQuestion ? (
            /* Question block — bold label + required asterisk + field preview */
            <div>
              <div className="relative flex items-baseline gap-1">
                <MentionOverlay
                  content={block.content}
                  mentions={block.mentions}
                  className="text-base font-semibold text-transparent"
                />
                <input
                  ref={ref}
                  type="text"
                  value={block.content}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  className="relative w-full bg-transparent text-base font-semibold text-[var(--editor-text,inherit)] placeholder:text-[var(--editor-placeholder)] placeholder:font-normal focus:outline-none"
                />
                {block.required !== false && (
                  <span className="shrink-0 text-sm text-red-500">*</span>
                )}
              </div>
              <BlockPreview
                type={block.type}
                placeholder={block.placeholder || ""}
                onPlaceholderChange={(value) =>
                  onUpdate(block.id, { placeholder: value })
                }
                options={block.options || ["Option 1"]}
                onOptionsChange={(options) =>
                  onUpdate(block.id, { options })
                }
              />
            </div>
          ) : isLayoutDivider ? (
            /* Divider / New page / Thank you page — non-editable visual element */
            <div>
              <input
                ref={ref}
                type="text"
                value=""
                onChange={() => {}}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="sr-only"
                tabIndex={-1}
              />
              {block.type === "divider" ? (
                <hr className="my-2 border-border" />
              ) : (
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 border-t border-dashed border-border" />
                  <span className="shrink-0 text-sm font-medium text-muted-foreground/60">
                    {block.type === "thank_you_page" ? "Thank you page" : "Page 2"}
                  </span>
                  <div className="h-px flex-1 border-t border-dashed border-border" />
                </div>
              )}
            </div>
          ) : isLayoutInput ? (
            /* Heading / Title / Label — styled text input */
            (() => {
              const style = LAYOUT_INPUT_STYLES[block.type];
              return (
                <div className="relative">
                  <MentionOverlay
                    content={block.content}
                    mentions={block.mentions}
                    className={`text-transparent ${style.className}`}
                  />
                  <input
                    ref={ref}
                    type="text"
                    value={block.content}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={style.placeholder}
                    className={`relative w-full bg-transparent text-[var(--editor-text,inherit)] placeholder:text-[var(--editor-placeholder)] focus:outline-none ${style.className}`}
                  />
                </div>
              );
            })()
          ) : (
            /* Text block — plain input with / trigger */
            <div className="relative">
              <MentionOverlay
                content={block.content}
                mentions={block.mentions}
                className="text-base text-transparent"
              />
              <input
                ref={ref}
                type="text"
                value={block.content}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="relative w-full bg-transparent text-base text-[var(--editor-text,inherit)] placeholder:text-[var(--editor-placeholder)] focus:outline-none"
              />
            </div>
          )}
        </div>
      </SlashCommandMenu>
    </div>
  );
}
