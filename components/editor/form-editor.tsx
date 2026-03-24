"use client";

import { useState, useCallback, useEffect, useMemo, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight, Move, Save } from "lucide-react";
import { EditorTitle } from "./editor-title";
import { EditorPlaceholder } from "./editor-placeholder";
import { BlockList, createBlock, type BlockListHandle } from "./block-list";
import { CoverPicker } from "./cover-picker";
import { FormPreview } from "@/components/preview/form-preview";
import { FlowCanvas } from "./flow-canvas";
import { useCustomizationStore, FONT_MAP } from "@/stores/customization-store";
import { useFormContentStore } from "@/stores/form-content-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Block } from "./types";

/** Split blocks into page sections by new_page dividers.
 *  new_page blocks go at the START of the next section so the
 *  Next button renders above the page divider. */
function splitEditorPages(blocks: Block[]): Block[][] {
  const pages: Block[][] = [[]];
  for (const block of blocks) {
    if (block.type === "new_page") {
      pages.push([block]);
    } else {
      pages[pages.length - 1].push(block);
    }
  }
  return pages;
}

export function FormEditor() {
  const custom = useCustomizationStore((s) => s.state);
  const formId = useFormContentStore((s) => s.formId);
  const title = useFormContentStore((s) => s.title);
  const setTitle = useFormContentStore((s) => s.setTitle);
  const icon = useFormContentStore((s) => s.icon);
  const setIcon = useFormContentStore((s) => s.setIcon);
  const cover = useFormContentStore((s) => s.cover);
  const setCover = useFormContentStore((s) => s.setCover);
  const blocks = useFormContentStore((s) => s.blocks);
  const setBlocks = useFormContentStore((s) => s.setBlocks);
  const previewing = useFormContentStore((s) => s.previewing);
  const setPreviewing = useFormContentStore((s) => s.setPreviewing);
  const canvasMode = useFormContentStore((s) => s.canvasMode);
  const setCanvasMode = useFormContentStore((s) => s.setCanvasMode);
  const [manuallyStarted, setManuallyStarted] = useState(false);
  const started = manuallyStarted || blocks.length > 0;
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  const blockListRef = useRef<BlockListHandle>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const hasCover = !!cover;

  // ── Auto-save ──
  const { save: autoSave } = useAutoSave(formId);
  const isFirstRender = useRef(true);
  useEffect(() => {
    // Skip the initial render to avoid saving default data
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    autoSave({ title, icon, cover, blocks, customization: custom, published: false });
  }, [title, icon, cover, blocks, custom, autoSave]);

  // ── Cover reposition state ──
  const [repositioning, setRepositioning] = useState(false);
  const [tempPositionY, setTempPositionY] = useState(50);
  const dragStartRef = useRef<{ startY: number; startPos: number } | null>(null);

  const startReposition = useCallback(() => {
    setTempPositionY(cover?.positionY ?? 50);
    setRepositioning(true);
  }, [cover?.positionY]);

  const saveReposition = useCallback(() => {
    if (cover) setCover({ ...cover, positionY: tempPositionY });
    setRepositioning(false);
  }, [cover, setCover, tempPositionY]);

  const cancelReposition = useCallback(() => {
    setRepositioning(false);
  }, []);

  const handleCoverPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!repositioning || !coverRef.current) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = { startY: e.clientY, startPos: tempPositionY };
  }, [repositioning, tempPositionY]);

  const handleCoverPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !coverRef.current) return;
    const containerHeight = coverRef.current.getBoundingClientRect().height;
    const deltaY = e.clientY - dragStartRef.current.startY;
    // Moving mouse down → image shifts up → positionY increases
    const deltaPercent = (deltaY / containerHeight) * 100;
    const newPos = Math.min(100, Math.max(0, dragStartRef.current.startPos + deltaPercent));
    setTempPositionY(newPos);
  }, []);

  const handleCoverPointerUp = useCallback(() => {
    dragStartRef.current = null;
  }, []);

  // Split blocks into pages for rendering per-page buttons
  const editorPages = useMemo(() => splitEditorPages(blocks), [blocks]);
  // Check if form has any new_page blocks (multi-page form)
  const hasPages = blocks.some((b) => b.type === "new_page");

  const handleStart = useCallback(() => {
    if (blocks.length === 0) {
      setBlocks([createBlock()]);
    }
    setManuallyStarted(true);
  }, [blocks.length, setBlocks]);

  const handleTitleEnter = useCallback(() => {
    if (!started) {
      handleStart();
    } else {
      blockListRef.current?.focusFirst();
    }
  }, [started, handleStart]);

  const handleBottomClick = useCallback(() => {
    if (!started) return;
    // Find last non-thank_you block
    const lastBlock = [...blocks].reverse().find((b) => b.type !== "thank_you_page");
    // Don't add if the last block is already an empty text block
    if (lastBlock?.type === "text" && lastBlock.content === "") {
      // Just focus the existing empty block
      blockListRef.current?.focusBlock(lastBlock.id);
      return;
    }

    const newBlock = createBlock();
    const tyIndex = blocks.findIndex((b) => b.type === "thank_you_page");
    const newBlocks = [...blocks];
    if (tyIndex !== -1) {
      newBlocks.splice(tyIndex, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }
    setBlocks(newBlocks);
    // Focus the new block after render
    setTimeout(() => blockListRef.current?.focusBlock(newBlock.id), 0);
  }, [started, blocks]);

  // Allow Enter key on the title input to start the editor
  useEffect(() => {
    if (started) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleStart();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [started, handleStart]);

  if (previewing) {
    return (
      <FormPreview
        formId={formId}
        blocks={blocks}
        title={title}
        icon={icon}
        cover={cover}
        onClose={() => setPreviewing(false)}
      />
    );
  }

  if (canvasMode) {
    return (
      <FlowCanvas blocks={blocks} onClose={() => setCanvasMode(false)} />
    );
  }

  const btnStyle: React.CSSProperties = {
    backgroundColor: custom.btnBg,
    color: custom.btnText,
    borderRadius: `${custom.btnCornerRadius}px`,
    fontSize: `${custom.btnFontSize}px`,
    height: `${custom.btnHeight}px`,
    padding: `0 ${custom.btnHPadding}px`,
    width: custom.btnWidth === "auto" ? undefined : custom.btnWidth === "full" ? "100%" : `${custom.btnWidth}px`,
  };

  const btnJustify =
    custom.btnAlignment === "center"
      ? "center"
      : custom.btnAlignment === "right"
        ? "flex-end"
        : "flex-start";

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{
        backgroundColor: custom.bgColor,
        color: custom.textColor,
        fontFamily: FONT_MAP[custom.font] ?? FONT_MAP["google-sans"],
        fontSize: `${custom.baseFontSize}px`,
        "--editor-text": custom.textColor,
        "--editor-placeholder": custom.inputPlaceholder,
        "--editor-input-bg": custom.inputBg,
        "--editor-input-border": custom.inputBorder,
        "--editor-input-border-w": `${custom.inputBorderWidth}px`,
        "--editor-input-radius": `${custom.inputBorderRadius}px`,
        "--editor-input-height": `${custom.inputHeight}px`,
        "--editor-input-hpad": `${custom.inputHPadding}px`,
      } as React.CSSProperties}
    >
      {/* Cover image — full width, outside the max-w container */}
      {hasCover && (
        <div
          ref={coverRef}
          className={`relative group/cover ${repositioning ? "cursor-grab active:cursor-grabbing" : ""}`}
          style={{ height: `${custom.coverHeight}vh` }}
          onPointerDown={repositioning ? handleCoverPointerDown : undefined}
          onPointerMove={repositioning ? handleCoverPointerMove : undefined}
          onPointerUp={repositioning ? handleCoverPointerUp : undefined}
        >
          {cover.type === "url" ? (
            <img
              src={cover.value}
              alt="Cover"
              className="h-full w-full object-cover pointer-events-none select-none"
              draggable={false}
              style={{
                objectPosition: `center ${repositioning ? tempPositionY : (cover.positionY ?? 50)}%`,
              }}
            />
          ) : (
            <div className={`h-full w-full ${cover.value}`} />
          )}

          {/* Reposition overlay */}
          {repositioning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="rounded-md bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Drag image to reposition
              </span>
            </div>
          )}

          {/* Controls */}
          <div className={`absolute bottom-3 right-4 flex items-center gap-1.5 ${repositioning ? "opacity-100" : "opacity-0 transition-opacity duration-200 group-hover/cover:opacity-100"}`}>
            {repositioning ? (
              <>
                <button
                  onClick={saveReposition}
                  className="flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <Save className="h-3 w-3" />
                  Save position
                </button>
                <button
                  onClick={cancelReposition}
                  className="rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-background"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <CoverPicker
                  open={coverPickerOpen}
                  onOpenChange={setCoverPickerOpen}
                  onSelect={setCover}
                  onRemove={() => setCover(null)}
                  hasCover
                >
                  <button className="rounded-md bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-background">
                    Change cover
                  </button>
                </CoverPicker>
                <button
                  onClick={startReposition}
                  className="flex items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <Move className="h-3 w-3" />
                  Reposition
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content area — constrained width */}
      <div className="mx-auto pl-24 pr-6" style={{ maxWidth: `${custom.pageWidth}px` }}>
        {/* Top padding — less when cover is present */}
        <div className={hasCover ? "pt-4" : "pt-24"} />

        <EditorTitle
          title={title}
          onTitleChange={setTitle}
          showCoverOptions={started}
          icon={icon}
          hasCover={hasCover}
          onIconChange={setIcon}
          onCoverChange={setCover}
          onEnter={handleTitleEnter}
        />

        {started ? (
          <>
            {hasPages ? (
              /* Multi-page: render blocks with Next/Submit per page section */
              editorPages.map((pageBlocks, pageIndex) => {
                const isLast = pageIndex === editorPages.length - 1;
                // Filter out thank_you_page from counting — it's always at the end
                const hasThankYouOnly =
                  pageBlocks.length === 1 &&
                  pageBlocks[0].type === "thank_you_page";

                return (
                  <div key={pageIndex}>
                    <BlockList
                      ref={pageIndex === 0 ? blockListRef : undefined}
                      blocks={pageBlocks}
                      onBlocksChange={(updated) => {
                        // Reconstruct full blocks array from page sections
                        const newPages = [...editorPages];
                        newPages[pageIndex] = updated;
                        setBlocks(newPages.flat());
                      }}
                    />
                    {!hasThankYouOnly && (
                      <div
                        style={{
                          marginTop: `${custom.btnVMargin}px`,
                          display: "flex",
                          justifyContent: btnJustify,
                        }}
                      >
                        <button
                          className="inline-flex items-center gap-2 font-medium transition-opacity hover:opacity-90"
                          style={btnStyle}
                        >
                          {isLast ? "Submit" : "Next"}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* Single page */
              <>
                <BlockList ref={blockListRef} blocks={blocks} onBlocksChange={setBlocks} />
                <div
                  style={{
                    marginTop: `${custom.btnVMargin}px`,
                    display: "flex",
                    justifyContent: btnJustify,
                  }}
                >
                  <button
                    className="inline-flex items-center gap-2 font-medium transition-opacity hover:opacity-90"
                    style={btnStyle}
                  >
                    Submit
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <EditorPlaceholder onStart={handleStart} />
        )}

        {/* Bottom padding — click to add a new block */}
        <div
          className="h-64 cursor-text"
          onClick={handleBottomClick}
        />
      </div>
    </div>
  );
}
