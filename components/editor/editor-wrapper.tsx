"use client";

import { useRef } from "react";
import { useFormContentStore } from "@/stores/form-content-store";
import { useCustomizationStore, type CustomizationState } from "@/stores/customization-store";
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
  customization: Record<string, string>;
}

interface EditorWrapperProps {
  children: React.ReactNode;
  initialData?: EditorInitialData | null;
}

export function EditorWrapper({ children, initialData }: EditorWrapperProps) {
  const prevFormId = useRef<string | null>(null);

  if (initialData && initialData.formId !== prevFormId.current) {
    useFormContentStore.getState().initialize({
      formId: initialData.formId,
      workspaceId: initialData.workspaceId,
      title: initialData.title,
      icon: initialData.icon,
      cover: initialData.cover,
      published: initialData.published,
      blocks: initialData.blocks,
    });
    useCustomizationStore.getState().initialize(
      initialData.customization as Partial<CustomizationState>
    );
    prevFormId.current = initialData.formId;
  }

  return <>{children}</>;
}
