"use client";

import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { CoverValue } from "@/components/editor/cover-picker";
import type { Block } from "@/components/editor/types";

export interface EditorInitialData {
  formId: string;
  workspaceId: string;
  title: string;
  icon: string | null;
  cover: CoverValue | null;
  published: boolean;
  blocks: Block[];
}

interface FormContentState {
  formId: string | null;
  workspaceId: string | null;
  title: string;
  icon: string | null;
  cover: CoverValue | null;
  published: boolean;
  blocks: Block[];
  previewing: boolean;
  canvasMode: boolean;

  initialize: (data: EditorInitialData) => void;
  setTitle: (title: string) => void;
  setIcon: (icon: string | null) => void;
  setCover: (cover: CoverValue | null) => void;
  setPublished: (published: boolean) => void;
  setBlocks: (blocks: Block[]) => void;
  setPreviewing: (previewing: boolean) => void;
  setCanvasMode: (canvasMode: boolean) => void;
  toggleCanvasMode: () => void;
}

export const useFormContentStore = create<FormContentState>()(
  devtools(
    subscribeWithSelector((set) => ({
      formId: null,
      workspaceId: null,
      title: "",
      icon: null,
      cover: null,
      published: false,
      blocks: [],
      previewing: false,
      canvasMode: false,

      initialize: (data) =>
        set({
          formId: data.formId,
          workspaceId: data.workspaceId,
          title: data.title,
          icon: data.icon,
          cover: data.cover,
          published: data.published,
          blocks: data.blocks,
          previewing: false,
          canvasMode: false,
        }),

      setTitle: (title) => set({ title }),
      setIcon: (icon) => set({ icon }),
      setCover: (cover) => set({ cover }),
      setPublished: (published) => set({ published }),
      setBlocks: (blocks) => set({ blocks }),
      setPreviewing: (previewing) => set({ previewing }),
      setCanvasMode: (canvasMode) => set({ canvasMode }),
      toggleCanvasMode: () => set((state) => ({ canvasMode: !state.canvasMode })),
    })),
    { name: "form-content-store" }
  )
);
