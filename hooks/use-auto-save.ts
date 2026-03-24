"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { saveFormAction } from "@/app/(dashboard)/forms/actions";
import { useWorkspaceStore } from "@/stores/workspace-store";
import type { FormData } from "@/db/schema";
import type { CoverValue } from "@/components/editor/cover-picker";
import type { Block } from "@/components/editor/types";
import type { CustomizationState } from "@/stores/customization-store";

interface AutoSaveData {
  title: string;
  icon: string | null;
  cover: CoverValue | null;
  blocks: Block[];
  customization: CustomizationState;
  published: boolean;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const DEBOUNCE_MS = 1000;

export function useAutoSave(formId: string | null) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<AutoSaveData | null>(null);
  const savingRef = useRef(false);

  const flush = useCallback(async () => {
    if (!formId || !latestRef.current || savingRef.current) return;

    const data = latestRef.current;
    latestRef.current = null;
    savingRef.current = true;
    setStatus("saving");

    try {
      const formData: FormData = {
        blocks: data.blocks as unknown as Record<string, unknown>[],
        customization: data.customization as unknown as Record<string, string>,
      };

      await saveFormAction(formId, {
        title: data.title,
        icon: data.icon,
        coverType: data.cover?.type ?? null,
        coverValue: data.cover?.value ?? null,
        coverPositionY: data.cover?.positionY ?? null,
        formData,
        published: data.published,
      });

      setStatus("saved");

      // Sync title to workspace store so sidebar updates
      useWorkspaceStore.getState().renameForm(formId, data.title);

      // If more changes came in while we were saving, flush again
      if (latestRef.current) {
        savingRef.current = false;
        flush();
        return;
      }
    } catch {
      setStatus("error");
    }

    savingRef.current = false;
  }, [formId]);

  const save = useCallback(
    (data: AutoSaveData) => {
      latestRef.current = data;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, DEBOUNCE_MS);
    },
    [flush],
  );

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // Fire a final save synchronously if data is pending
      if (latestRef.current && formId) {
        flush();
      }
    };
  }, [flush, formId]);

  return { save, status };
}
