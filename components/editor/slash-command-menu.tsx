"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  TextCursorInput,
  LayoutGrid,
  Image,
  Settings,
  ChevronRight,
  SearchIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import {
  BLOCK_TYPES,
  BLOCK_CATEGORIES,
  HIDDEN_BLOCK_TYPES,
  type BlockType,
  type BlockCategory,
} from "./types";
import { BLOCK_ICON_MAP as ICON_MAP } from "./icon-map";

const CATEGORY_ICONS: Record<
  BlockCategory,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "Input blocks": TextCursorInput,
  "Layout blocks": LayoutGrid,
  "Embed blocks": Image,
  "Advanced blocks": Settings,
};

function getBlocksByCategory(category: BlockCategory) {
  return BLOCK_TYPES.filter((b) => b.category === category && !HIDDEN_BLOCK_TYPES.has(b.type));
}

interface SlashCommandMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
  children: React.ReactNode;
}

type FocusTarget = "categories" | "items" | "search";

export function SlashCommandMenu({
  open,
  onClose,
  onSelect,
  children,
}: SlashCommandMenuProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<BlockCategory | null>(
    BLOCK_CATEGORIES[0]
  );
  const [focusTarget, setFocusTarget] = useState<FocusTarget>("categories");
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for scrolling active items into view
  const categoryListRef = useRef<HTMLDivElement>(null);
  const itemsListRef = useRef<HTMLDivElement>(null);
  const searchListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSearch("");
      setHoveredCategory(BLOCK_CATEGORIES[0]);
      setFocusTarget("categories");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSelect = useCallback(
    (type: BlockType) => {
      onSelect(type);
      onClose();
    },
    [onSelect, onClose]
  );

  const filteredBlocks = search
    ? BLOCK_TYPES.filter((b) =>
        b.label.toLowerCase().includes(search.toLowerCase()) && !HIDDEN_BLOCK_TYPES.has(b.type)
      )
    : null;

  // Reset activeIndex when search changes
  useEffect(() => {
    if (search) {
      setFocusTarget("search");
      setActiveIndex(0);
    } else {
      setFocusTarget("categories");
      setActiveIndex(0);
    }
  }, [search]);

  // Scroll active item into view
  useEffect(() => {
    const listRef =
      focusTarget === "categories"
        ? categoryListRef
        : focusTarget === "items"
          ? itemsListRef
          : searchListRef;

    const container = listRef.current;
    if (!container) return;
    const el = container.querySelector(`[data-index="${activeIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, focusTarget]);

  // Get the items list for the currently hovered category
  const categoryItems = hoveredCategory
    ? getBlocksByCategory(hoveredCategory)
    : [];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (focusTarget === "search" && filteredBlocks) {
        // Search mode navigation
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filteredBlocks.length - 1));
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
            break;
          case "Enter":
            e.preventDefault();
            if (filteredBlocks[activeIndex]) {
              handleSelect(filteredBlocks[activeIndex].type);
            }
            break;
          case "Escape":
            e.preventDefault();
            onClose();
            break;
        }
        return;
      }

      if (focusTarget === "categories") {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setActiveIndex((i) =>
              Math.min(i + 1, BLOCK_CATEGORIES.length - 1)
            );
            setHoveredCategory(
              BLOCK_CATEGORIES[
                Math.min(activeIndex + 1, BLOCK_CATEGORIES.length - 1)
              ]
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
            setHoveredCategory(BLOCK_CATEGORIES[Math.max(activeIndex - 1, 0)]);
            break;
          case "ArrowRight":
          case "Enter":
            e.preventDefault();
            if (hoveredCategory) {
              setFocusTarget("items");
              setActiveIndex(0);
            }
            break;
          case "Escape":
            e.preventDefault();
            onClose();
            break;
        }
        return;
      }

      if (focusTarget === "items") {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setActiveIndex((i) =>
              Math.min(i + 1, categoryItems.length - 1)
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
            break;
          case "Enter":
            e.preventDefault();
            if (categoryItems[activeIndex]) {
              handleSelect(categoryItems[activeIndex].type);
            }
            break;
          case "ArrowLeft":
          case "Escape":
            e.preventDefault();
            setFocusTarget("categories");
            setActiveIndex(
              BLOCK_CATEGORIES.indexOf(hoveredCategory as BlockCategory)
            );
            break;
        }
      }
    },
    [
      focusTarget,
      activeIndex,
      filteredBlocks,
      hoveredCategory,
      categoryItems,
      handleSelect,
      onClose,
    ]
  );

  return (
    <Popover open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent
        className="w-[220px] p-0 shadow-lg rounded-lg border overflow-visible"
        align="start"
        side="bottom"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="relative">
          {/* Main panel — categories or search results */}
          <div>
            {/* Search input */}
            <div className="flex items-center gap-2 border-b px-3 h-10">
              <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search blocks..."
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>

            <div className="py-1">
              {filteredBlocks ? (
                /* Search results — flat list */
                filteredBlocks.length > 0 ? (
                  <div
                    ref={searchListRef}
                    className="max-h-[320px] overflow-y-auto"
                  >
                    {filteredBlocks.map((block, index) => {
                      const Icon = ICON_MAP[block.icon];
                      const isActive =
                        focusTarget === "search" && activeIndex === index;
                      return (
                        <button
                          key={block.type}
                          data-index={index}
                          onClick={() => handleSelect(block.type)}
                          onMouseEnter={() => {
                            setFocusTarget("search");
                            setActiveIndex(index);
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
                          <span>{block.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No blocks found.
                  </p>
                )
              ) : (
                /* Category list */
                <div ref={categoryListRef}>
                  {BLOCK_CATEGORIES.map((category, index) => {
                    const CategoryIcon = CATEGORY_ICONS[category];
                    const isActive =
                      focusTarget === "categories" && activeIndex === index;
                    return (
                      <button
                        key={category}
                        data-index={index}
                        onMouseEnter={() => {
                          setHoveredCategory(category);
                          setFocusTarget("categories");
                          setActiveIndex(index);
                        }}
                        onClick={() => {
                          setHoveredCategory(category);
                          setFocusTarget("items");
                          setActiveIndex(0);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-1.5 text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <CategoryIcon
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isActive
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            }`}
                            strokeWidth={1.5}
                          />
                          <span>{category}</span>
                        </span>
                        <ChevronRight
                          className={`h-3.5 w-3.5 ${
                            isActive
                              ? "text-primary-foreground/60"
                              : "text-muted-foreground/60"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-3 py-1.5">
              <button
                onClick={onClose}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close menu
              </button>
              <kbd className="text-[10px] font-mono text-muted-foreground/60 bg-muted rounded px-1.5 py-0.5">
                esc
              </kbd>
            </div>
          </div>

          {/* Submenu panel — separate floating card */}
          {!filteredBlocks && hoveredCategory && (
            <div className="absolute top-0 left-full ml-1 w-[220px] rounded-lg border bg-popover shadow-lg">
              <div className="px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {hoveredCategory}
                </span>
              </div>
              <div
                ref={itemsListRef}
                className="max-h-[320px] overflow-y-auto pb-1"
              >
                {categoryItems.map((block, index) => {
                  const Icon = ICON_MAP[block.icon];
                  const isActive =
                    focusTarget === "items" && activeIndex === index;
                  return (
                    <button
                      key={block.type}
                      data-index={index}
                      onClick={() => handleSelect(block.type)}
                      onMouseEnter={() => {
                        setFocusTarget("items");
                        setActiveIndex(index);
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
                      <span>{block.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
