"use client";

import { useCallback, useMemo, useRef, createRef, forwardRef, useImperativeHandle } from "react";
import { nanoid } from "nanoid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { BlockRow } from "./block-row";
import { useCustomizationStore } from "@/stores/customization-store";
import type { Block } from "./types";

interface BlockListProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
}

function createBlock(): Block {
  return { id: nanoid(8), type: "text", content: "" };
}

export interface BlockListHandle {
  focusFirst: () => void;
  focusBlock: (id: string) => void;
}

export const BlockList = forwardRef<BlockListHandle, BlockListProps>(
  function BlockList({ blocks, onBlocksChange }, ref) {
  const custom = useCustomizationStore((s) => s.state);
  const inputRefs = useRef<Map<string, React.RefObject<HTMLInputElement | null>>>(new Map());

  const getRef = (id: string) => {
    if (!inputRefs.current.has(id)) {
      inputRefs.current.set(id, createRef<HTMLInputElement>());
    }
    return inputRefs.current.get(id)!;
  };

  const focusBlock = useCallback((id: string) => {
    setTimeout(() => {
      inputRefs.current.get(id)?.current?.focus();
    }, 0);
  }, []);

  useImperativeHandle(ref, () => ({
    focusFirst: () => {
      if (blocks.length > 0) {
        focusBlock(blocks[0].id);
      }
    },
    focusBlock,
  }), [blocks, focusBlock]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      let newBlocks = arrayMove(blocks, oldIndex, newIndex);

      // Ensure thank_you_page stays at the end
      const tyIndex = newBlocks.findIndex((b) => b.type === "thank_you_page");
      if (tyIndex !== -1 && tyIndex !== newBlocks.length - 1) {
        const [ty] = newBlocks.splice(tyIndex, 1);
        newBlocks.push(ty);
      }

      onBlocksChange(newBlocks);
    },
    [blocks, onBlocksChange]
  );

  const handleUpdate = useCallback(
    (id: string, updates: Partial<Block>) => {
      let newBlocks = blocks.map((b) => {
        if (b.id !== id) return b;
        const updated = { ...b, ...updates };
        // Remove keys explicitly set to undefined (e.g. toggling off defaultAnswer)
        for (const key of Object.keys(updates)) {
          if ((updates as Record<string, unknown>)[key] === undefined) {
            delete (updated as Record<string, unknown>)[key];
          }
        }
        return updated;
      });
      // If block became a thank_you_page, move it to the end
      if (updates.type === "thank_you_page") {
        const block = newBlocks.find((b) => b.id === id)!;
        newBlocks = [
          ...newBlocks.filter((b) => b.id !== id),
          block,
        ];
      }
      onBlocksChange(newBlocks);
    },
    [blocks, onBlocksChange]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (blocks.length <= 1) {
        // Reset the last block to an empty text block instead of removing it
        const fresh = createBlock();
        inputRefs.current.delete(id);
        onBlocksChange([fresh]);
        focusBlock(fresh.id);
        return;
      }
      const index = blocks.findIndex((b) => b.id === id);
      const newBlocks = blocks.filter((b) => b.id !== id);
      inputRefs.current.delete(id);
      onBlocksChange(newBlocks);

      // Focus the previous block, or the first one
      const focusIndex = Math.max(0, index - 1);
      if (newBlocks[focusIndex]) {
        focusBlock(newBlocks[focusIndex].id);
      }
    },
    [blocks, onBlocksChange, focusBlock]
  );

  const handleAddBelow = useCallback(
    (id: string) => {
      const index = blocks.findIndex((b) => b.id === id);
      const newBlock = createBlock();
      const newBlocks = [...blocks];
      // If the current block is a thank_you_page, insert before it instead of after
      const insertIndex =
        blocks[index].type === "thank_you_page" ? index : index + 1;
      newBlocks.splice(insertIndex, 0, newBlock);
      onBlocksChange(newBlocks);
      focusBlock(newBlock.id);
    },
    [blocks, onBlocksChange, focusBlock]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index === -1) return;
      const original = blocks[index];
      const duplicate: Block = { ...original, id: nanoid(8) };
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, duplicate);
      onBlocksChange(newBlocks);
      focusBlock(duplicate.id);
    },
    [blocks, onBlocksChange, focusBlock]
  );

  const handleEnter = useCallback(
    (id: string) => {
      handleAddBelow(id);
    },
    [handleAddBelow]
  );

  const handleBackspace = useCallback(
    (id: string) => {
      // Delete current empty text block and focus previous
      if (blocks.length > 1) {
        handleDelete(id);
      }
    },
    [blocks.length, handleDelete]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
        <div className="mt-6" style={{ display: "flex", flexDirection: "column", gap: `${custom.inputMarginBottom}px` }}>
          {blocks.map((block) => (
            <BlockRow
              key={block.id}
              block={block}
              allBlocks={blocks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAddBelow={handleAddBelow}
              onDuplicate={handleDuplicate}
              onEnter={handleEnter}
              onBackspace={handleBackspace}
              inputRef={getRef(block.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
});

export { createBlock };
