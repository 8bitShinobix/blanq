"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import {
  createWorkspaceAction,
  renameWorkspaceAction,
  deleteWorkspaceAction,
  restoreFormAction,
  permanentlyDeleteFormAction,
  emptyTrashAction,
} from "@/app/(dashboard)/forms/actions";

export type Role = "owner" | "admin" | "member";

export interface WorkspaceForm {
  id: string;
  title: string;
  slug: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
}

export interface WorkspaceInvite {
  id: string;
  email: string;
  role: Role;
  sentAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  isDefault: boolean;
  forms: WorkspaceForm[];
  members: WorkspaceMember[];
  invites: WorkspaceInvite[];
}

export interface OwnerUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface TrashedForm {
  id: string;
  title: string;
  slug: string;
  workspaceId: string;
  workspaceName: string;
  deletedAt: Date;
}

export interface InitialWorkspace {
  id: string;
  name: string;
  isDefault: boolean;
  forms: WorkspaceForm[];
}

function buildWorkspaces(
  owner: OwnerUser | null,
  initial?: InitialWorkspace[],
): Workspace[] {
  const ownerMember: WorkspaceMember[] = owner
    ? [{ id: owner.id, name: owner.name, email: owner.email, image: owner.image, role: "owner" }]
    : [];

  if (initial && initial.length > 0) {
    return initial.map((ws) => ({
      ...ws,
      members: [...ownerMember],
      invites: [],
    }));
  }

  return [];
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentUser: OwnerUser | null;
  trash: TrashedForm[];

  initialize: (user: OwnerUser | null, initialWorkspaces?: InitialWorkspace[], initialTrash?: TrashedForm[]) => void;
  addWorkspace: (name: string) => Promise<void>;
  addForm: (workspaceId: string) => string;
  addFormToWorkspace: (workspaceId: string, form: WorkspaceForm) => void;
  renameWorkspace: (id: string, name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  renameForm: (formId: string, title: string) => void;
  deleteForm: (workspaceId: string, formId: string) => void;
  restoreForm: (formId: string) => Promise<void>;
  permanentlyDeleteForm: (formId: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  inviteMember: (workspaceId: string, email: string, role: Role) => void;
  removeMember: (workspaceId: string, memberId: string) => void;
  changeRole: (workspaceId: string, memberId: string, role: Role) => void;
  revokeInvite: (workspaceId: string, inviteId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    (set, get) => ({
      workspaces: [],
      currentUser: null,
      trash: [],

      initialize: (user, initialWorkspaces, initialTrash) => {
        set({
          currentUser: user,
          workspaces: buildWorkspaces(user, initialWorkspaces),
          trash: initialTrash ?? [],
        });
      },

      addWorkspace: async (name) => {
        const { currentUser } = get();
        const tempId = nanoid();
        const members: WorkspaceMember[] = currentUser
          ? [{ id: currentUser.id, name: currentUser.name, email: currentUser.email, image: currentUser.image, role: "owner" }]
          : [];

        // Optimistic: add workspace with temp ID
        set((state) => ({
          workspaces: [
            ...state.workspaces,
            { id: tempId, name, isDefault: false, forms: [], members, invites: [] },
          ],
        }));

        try {
          const result = await createWorkspaceAction(name);
          // Replace temp ID with real ID
          set((state) => ({
            workspaces: state.workspaces.map((ws) =>
              ws.id === tempId ? { ...ws, id: result.id } : ws
            ),
          }));
        } catch {
          // Revert on error
          set((state) => ({
            workspaces: state.workspaces.filter((ws) => ws.id !== tempId),
          }));
          throw new Error("Failed to create workspace");
        }
      },

      addForm: (workspaceId) => {
        const slug = nanoid(10);
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? { ...ws, forms: [...ws.forms, { id: nanoid(), title: "Untitled", slug }] }
              : ws
          ),
        }));
        return slug;
      },

      addFormToWorkspace: (workspaceId, form) => {
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? { ...ws, forms: [...ws.forms, form] }
              : ws
          ),
        }));
      },

      renameForm: (formId, title) => {
        set((state) => ({
          workspaces: state.workspaces.map((ws) => ({
            ...ws,
            forms: ws.forms.map((f) =>
              f.id === formId ? { ...f, title } : f
            ),
          })),
        }));
      },

      renameWorkspace: async (id, name) => {
        const oldName = get().workspaces.find((ws) => ws.id === id)?.name;

        // Optimistic: update name immediately
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === id ? { ...ws, name } : ws
          ),
        }));

        try {
          await renameWorkspaceAction(id, name);
        } catch {
          // Revert on error
          if (oldName !== undefined) {
            set((state) => ({
              workspaces: state.workspaces.map((ws) =>
                ws.id === id ? { ...ws, name: oldName } : ws
              ),
            }));
          }
          throw new Error("Failed to rename workspace");
        }
      },

      deleteWorkspace: async (id) => {
        const { workspaces } = get();
        const deletedWs = workspaces.find((ws) => ws.id === id);
        if (!deletedWs) return;

        // Optimistic: remove workspace and move forms to default
        const formsToMove = deletedWs.forms;
        set((state) => ({
          workspaces: state.workspaces
            .filter((ws) => ws.id !== id)
            .map((ws) =>
              ws.isDefault && formsToMove.length > 0
                ? { ...ws, forms: [...ws.forms, ...formsToMove] }
                : ws
            ),
        }));

        try {
          await deleteWorkspaceAction(id);
        } catch {
          // Revert: re-add workspace and remove moved forms from default
          set((state) => ({
            workspaces: [
              ...state.workspaces.map((ws) =>
                ws.isDefault && formsToMove.length > 0
                  ? { ...ws, forms: ws.forms.filter((f) => !formsToMove.some((m) => m.id === f.id)) }
                  : ws
              ),
              deletedWs,
            ],
          }));
          throw new Error("Failed to delete workspace");
        }
      },

      deleteForm: (workspaceId, formId) => {
        set((state) => {
          const ws = state.workspaces.find((w) => w.id === workspaceId);
          const form = ws?.forms.find((f) => f.id === formId);
          return {
            workspaces: state.workspaces.map((w) =>
              w.id === workspaceId
                ? { ...w, forms: w.forms.filter((f) => f.id !== formId) }
                : w
            ),
            trash: ws && form
              ? [
                  ...state.trash,
                  {
                    id: form.id,
                    title: form.title,
                    slug: form.slug,
                    workspaceId: ws.id,
                    workspaceName: ws.name,
                    deletedAt: new Date(),
                  },
                ]
              : state.trash,
          };
        });
      },

      restoreForm: async (formId) => {
        const item = get().trash.find((t) => t.id === formId);
        if (!item) return;

        // Optimistic: move from trash back to workspace
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === item.workspaceId
              ? { ...w, forms: [...w.forms, { id: item.id, title: item.title, slug: item.slug }] }
              : w
          ),
          trash: state.trash.filter((t) => t.id !== formId),
        }));

        try {
          await restoreFormAction(formId);
        } catch {
          // Revert: move back to trash
          set((state) => ({
            workspaces: state.workspaces.map((w) =>
              w.id === item.workspaceId
                ? { ...w, forms: w.forms.filter((f) => f.id !== formId) }
                : w
            ),
            trash: [...state.trash, item],
          }));
          throw new Error("Failed to restore form");
        }
      },

      permanentlyDeleteForm: async (formId) => {
        const item = get().trash.find((t) => t.id === formId);

        // Optimistic: remove from trash
        set((state) => ({
          trash: state.trash.filter((t) => t.id !== formId),
        }));

        try {
          await permanentlyDeleteFormAction(formId);
        } catch {
          // Revert
          if (item) {
            set((state) => ({ trash: [...state.trash, item] }));
          }
          throw new Error("Failed to permanently delete form");
        }
      },

      emptyTrash: async () => {
        const previousTrash = get().trash;

        // Optimistic
        set({ trash: [] });

        try {
          await emptyTrashAction();
        } catch {
          // Revert
          set({ trash: previousTrash });
          throw new Error("Failed to empty trash");
        }
      },

      inviteMember: (workspaceId, email, role) => {
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? {
                  ...ws,
                  invites: [
                    ...ws.invites,
                    { id: nanoid(), email, role, sentAt: "Just now" },
                  ],
                }
              : ws
          ),
        }));
      },

      removeMember: (workspaceId, memberId) => {
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? { ...ws, members: ws.members.filter((m) => m.id !== memberId) }
              : ws
          ),
        }));
      },

      changeRole: (workspaceId, memberId, role) => {
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? {
                  ...ws,
                  members: ws.members.map((m) =>
                    m.id === memberId ? { ...m, role } : m
                  ),
                }
              : ws
          ),
        }));
      },

      revokeInvite: (workspaceId, inviteId) => {
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? { ...ws, invites: ws.invites.filter((i) => i.id !== inviteId) }
              : ws
          ),
        }));
      },
    }),
    { name: "workspace-store" }
  )
);
