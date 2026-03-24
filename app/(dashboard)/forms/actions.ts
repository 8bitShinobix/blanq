"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import {
  createForm,
  updateForm,
  deleteForm,
  getFormById,
  getFormByIdIncludingDeleted,
  restoreForm,
  permanentlyDeleteForm,
  permanentlyDeleteAllTrash,
} from "@/db/queries/forms";
import {
  getOrCreateDefaultWorkspace,
  createWorkspace,
  renameWorkspace,
  deleteWorkspace,
  moveFormsToWorkspace,
  getWorkspaceById,
} from "@/db/queries/workspaces";
import type { FormData } from "@/db/schema";

// ── Create ──────────────────────────────────────────────────────────────────

export async function createFormAction(workspaceId?: string) {
  const session = await requireAuth();
  const slug = nanoid(10);

  // Use provided workspace or get/create the default one
  let wsId = workspaceId;
  if (!wsId) {
    const defaultWs = await getOrCreateDefaultWorkspace(session.user.id);
    wsId = defaultWs.id;
  }

  const form = await createForm({
    userId: session.user.id,
    workspaceId: wsId,
    slug,
    title: "",
  });

  return { id: form.id, slug: form.slug };
}

// ── Save (auto-save) ───────────────────────────────────────────────────────

interface SaveFormInput {
  title?: string;
  icon?: string | null;
  coverType?: string | null;
  coverValue?: string | null;
  coverPositionY?: number | null;
  formData?: FormData;
  published?: boolean;
}

export async function saveFormAction(formId: string, data: SaveFormInput) {
  const session = await requireAuth();

  const existing = await getFormById(formId);
  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Form not found");
  }

  await updateForm(formId, {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.icon !== undefined && { icon: data.icon }),
    ...(data.coverType !== undefined && { coverType: data.coverType }),
    ...(data.coverValue !== undefined && { coverValue: data.coverValue }),
    ...(data.coverPositionY !== undefined && { coverPositionY: data.coverPositionY }),
    ...(data.formData !== undefined && { formData: data.formData }),
    ...(data.published !== undefined && { published: data.published }),
  });
}

// ── Delete ──────────────────────────────────────────────────────────────────

export async function deleteFormAction(formId: string) {
  const session = await requireAuth();

  const existing = await getFormById(formId);
  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Form not found");
  }

  await deleteForm(formId);
}

// ── Workspace Actions ─────────────────────────────────────────────────────

export async function createWorkspaceAction(name: string) {
  const session = await requireAuth();
  const ws = await createWorkspace({
    userId: session.user.id,
    name,
    isDefault: false,
  });
  return { id: ws.id, name: ws.name, isDefault: ws.isDefault };
}

export async function renameWorkspaceAction(id: string, name: string) {
  const session = await requireAuth();
  const ws = await getWorkspaceById(id);
  if (!ws || ws.userId !== session.user.id) {
    throw new Error("Workspace not found");
  }
  await renameWorkspace(id, name);
}

export async function deleteWorkspaceAction(id: string) {
  const session = await requireAuth();
  const ws = await getWorkspaceById(id);
  if (!ws || ws.userId !== session.user.id) {
    throw new Error("Workspace not found");
  }
  if (ws.isDefault) {
    throw new Error("Cannot delete the default workspace");
  }
  // Move forms to the default workspace before deleting
  const defaultWs = await getOrCreateDefaultWorkspace(session.user.id);
  await moveFormsToWorkspace(id, defaultWs.id);
  await deleteWorkspace(id);
}

// ── Trash Actions ─────────────────────────────────────────────────────────

export async function restoreFormAction(formId: string) {
  const session = await requireAuth();
  const existing = await getFormByIdIncludingDeleted(formId);
  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Form not found");
  }
  await restoreForm(formId);
}

export async function permanentlyDeleteFormAction(formId: string) {
  const session = await requireAuth();
  const existing = await getFormByIdIncludingDeleted(formId);
  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Form not found");
  }
  await permanentlyDeleteForm(formId);
}

export async function emptyTrashAction() {
  const session = await requireAuth();
  await permanentlyDeleteAllTrash(session.user.id);
}
