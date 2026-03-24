"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  Users,
  Globe,
  Zap,
  ChevronDown,
  ChevronRight,
  FileText,
  Sparkles,
  Map,
  MessageCircle,
  Gift,
  Trash2,
  Rocket,
  BookOpen,
  HelpCircle,
  Headphones,
  LogOut,
  MessageSquareHeart,
  Plus,
  MoreHorizontal,
  Pencil,
  Loader2,
} from "lucide-react";
import { useState, useCallback, useEffect, useTransition } from "react";
import { createFormAction, deleteFormAction } from "@/app/(dashboard)/forms/actions";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useWorkspaceStore } from "@/stores/workspace-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { authClient } from "@/lib/auth-client";
import { WorkspaceDialog } from "./workspace-dialog";
import { WorkspaceMembersDialog } from "./workspace-members-dialog";
import { CommandPalette } from "./command-palette";
import { WhatsNewSheet } from "./whats-new-sheet";

interface SidebarUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface AppSidebarProps {
  user: SidebarUser;
}

const mainNavItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Members", href: "/members", icon: Users },
  { label: "Domains", href: "/domains", icon: Globe },
];

const productNavItems = [
  { label: "Templates", href: "/templates", icon: FileText },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Feature requests", href: "/feature-requests", icon: MessageCircle },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Trash", href: "/trash", icon: Trash2 },
];

const helpNavItems = [
  { label: "Get started", href: "/get-started", icon: Rocket },
  { label: "How-to guides", href: "/guides", icon: BookOpen },
  { label: "Help center", href: "/help", icon: HelpCircle },
  { label: "Contact support", href: "/support", icon: Headphones },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const iconProps = { className: "!size-[18px] text-muted-foreground", strokeWidth: 1.5 } as const;

function SidebarFormItem({
  form,
  workspaceId,
  isActive,
}: {
  form: { id: string; title: string; slug: string };
  workspaceId: string;
  isActive: boolean;
}) {
  const deleteForm = useWorkspaceStore((s) => s.deleteForm);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNavigating, startNavTransition] = useTransition();

  const handleDelete = async () => {
    setIsDeleting(true);
    deleteForm(workspaceId, form.id);
    if (isActive) router.push("/dashboard");
    try {
      await deleteFormAction(form.id);
    } catch {
      // Already removed optimistically
    }
    router.refresh();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isActive) return; // Already on this page
    e.preventDefault();
    startNavTransition(() => {
      router.push(`/forms/${form.slug}`);
    });
  };

  return (
    <SidebarMenuSubItem className="group/form relative">
      <SidebarMenuSubButton
        asChild
        size="sm"
        isActive={isActive}
      >
        <Link href={`/forms/${form.slug}`} onClick={handleClick}>
          {isNavigating ? (
            <Loader2 className="h-3 w-3 animate-spin shrink-0" />
          ) : null}
          <span>{form.title}</span>
        </Link>
      </SidebarMenuSubButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-sidebar-foreground opacity-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-hover/form:opacity-100"
            disabled={isDeleting}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-36">
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuSubItem>
  );
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const addFormToWorkspace = useWorkspaceStore((s) => s.addFormToWorkspace);
  const renameWorkspace = useWorkspaceStore((s) => s.renameWorkspace);
  const deleteWorkspace = useWorkspaceStore((s) => s.deleteWorkspace);
  const [openWorkspaces, setOpenWorkspaces] = useState<Set<string>>(
    () => new Set<string>()
  );
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isPendingForm, startFormTransition] = useTransition();
  const [isNavigating, startNavTransition] = useTransition();
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "rename">("create");
  const [editingWorkspace, setEditingWorkspace] = useState<{ id: string; name: string } | null>(null);
  const [membersWorkspaceId, setMembersWorkspaceId] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleWorkspace = useCallback((id: string) => {
    setOpenWorkspaces((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAddForm = useCallback(
    (workspaceId: string) => {
      startFormTransition(async () => {
        const { id, slug } = await createFormAction(workspaceId);
        addFormToWorkspace(workspaceId, { id, title: "Untitled", slug });
        setOpenWorkspaces((prev) => new Set(prev).add(workspaceId));
        router.push(`/forms/${slug}`);
        router.refresh();
      });
    },
    [addFormToWorkspace, router]
  );

  const handleNavigate = useCallback((href: string) => {
    if (pathname === href) return;
    setNavigatingHref(href);
    startNavTransition(() => {
      router.push(href);
    });
  }, [pathname, router]);

  const handleAddWorkspace = useCallback(() => {
    setDialogMode("create");
    setEditingWorkspace(null);
    setDialogOpen(true);
  }, []);

  const handleRenameWorkspace = useCallback((ws: { id: string; name: string }) => {
    setDialogMode("rename");
    setEditingWorkspace(ws);
    setDialogOpen(true);
  }, []);

  const handleDialogSubmit = useCallback(
    (name: string) => {
      if (dialogMode === "create") {
        addWorkspace(name);
      } else if (editingWorkspace) {
        renameWorkspace(editingWorkspace.id, name);
      }
    },
    [dialogMode, editingWorkspace, addWorkspace, renameWorkspace]
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="offcanvas">
      {/* User Header */}
      <SidebarHeader className="p-2 pb-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-9">
                  <Avatar className="h-6 w-6 shrink-0 rounded-md">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-[11px] font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-sm font-medium">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-40" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={4}
                className="w-56"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/settings")}>
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Scrollable Content */}
      <SidebarContent className="gap-0">
        {/* Main Navigation */}
        <SidebarGroup className="px-2 py-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {mainNavItems.map((item) => {
                const isItemNavigating = isNavigating && navigatingHref === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      onClick={() => handleNavigate(item.href)}
                    >
                      {isItemNavigating ? (
                        <Loader2 className="!size-[18px] animate-spin text-muted-foreground" />
                      ) : (
                        <item.icon {...iconProps} />
                      )}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCommandOpen(true)}
                  tooltip="Search"
                >
                  <Search {...iconProps} />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Upgrade Plan CTA */}
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Upgrade plan"
                  onClick={() => handleNavigate("/upgrade")}
                  className="text-sidebar-primary font-medium"
                >
                  {isNavigating && navigatingHref === "/upgrade" ? (
                    <Loader2 className="!size-[18px] animate-spin text-muted-foreground" />
                  ) : (
                    <Zap {...iconProps} />
                  )}
                  <span>Upgrade plan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspaces */}
        <SidebarGroup className="px-2 py-1">
          <SidebarGroupLabel className="h-7 px-2 text-xs font-normal opacity-50">
            Workspaces
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {workspaces.map((ws) => {
                const isOpen = openWorkspaces.has(ws.id);
                return (
                  <Collapsible
                    key={ws.id}
                    open={isOpen}
                    onOpenChange={() => toggleWorkspace(ws.id)}
                    asChild
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={ws.name}>
                          <ChevronRight
                            className={`!size-[18px] transition-transform duration-200 ${
                              isOpen ? "rotate-90" : ""
                            }`}
                            strokeWidth={1.5}
                          />
                          <span>{ws.name}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction
                            showOnHover
                            className="right-6"
                          >
                            <MoreHorizontal />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-40">
                          <DropdownMenuItem onClick={() => handleRenameWorkspace({ id: ws.id, name: ws.name })}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setMembersWorkspaceId(ws.id)}>
                            <Users className="mr-2 h-3.5 w-3.5" />
                            Members
                          </DropdownMenuItem>
                          {!ws.isDefault && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => deleteWorkspace(ws.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <SidebarMenuAction
                        showOnHover
                        onClick={() => handleAddForm(ws.id)}
                        title="New form"
                        disabled={isPendingForm}
                      >
                        {isPendingForm ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus />
                        )}
                      </SidebarMenuAction>
                      <CollapsibleContent>
                        {ws.forms.length > 0 ? (
                          <SidebarMenuSub>
                            {ws.forms.map((form) => (
                              <SidebarFormItem
                                key={form.id}
                                form={form}
                                workspaceId={ws.id}
                                isActive={pathname === `/forms/${form.slug}`}
                              />
                            ))}
                          </SidebarMenuSub>
                        ) : (
                          <div className="ml-7 px-2 py-1 text-xs text-muted-foreground">
                            No forms yet
                          </div>
                        )}
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleAddWorkspace}
                  tooltip="New workspace"
                  className="text-muted-foreground"
                >
                  <Plus className="!size-[18px]" strokeWidth={1.5} />
                  <span>New workspace</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Product */}
        <SidebarGroup className="px-2 py-1">
          <SidebarGroupLabel className="h-7 px-2 text-xs font-normal opacity-50">
            Product
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {productNavItems.map((item) => {
                const isItemNavigating = isNavigating && navigatingHref === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      onClick={() => handleNavigate(item.href)}
                    >
                      {isItemNavigating ? (
                        <Loader2 className="!size-[18px] animate-spin text-muted-foreground" />
                      ) : (
                        <item.icon {...iconProps} />
                      )}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setWhatsNewOpen(true)}
                  tooltip="What's new"
                >
                  <Sparkles {...iconProps} />
                  <span>What&apos;s new</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Help */}
        <SidebarGroup className="px-2 py-1">
          <SidebarGroupLabel className="h-7 px-2 text-xs font-normal opacity-50">
            Help
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {helpNavItems.map((item) => {
                const isItemNavigating = isNavigating && navigatingHref === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      onClick={() => handleNavigate(item.href)}
                    >
                      {isItemNavigating ? (
                        <Loader2 className="!size-[18px] animate-spin text-muted-foreground" />
                      ) : (
                        <item.icon {...iconProps} />
                      )}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-2">
        <SidebarMenu className="gap-0">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Give Feedback"
              onClick={() => handleNavigate("/feedback")}
            >
              {isNavigating && navigatingHref === "/feedback" ? (
                <Loader2 className="!size-[18px] animate-spin text-muted-foreground" />
              ) : (
                <MessageSquareHeart {...iconProps} />
              )}
              <span>Give Feedback</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <WorkspaceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        defaultName={editingWorkspace?.name}
        onSubmit={handleDialogSubmit}
      />
      <WorkspaceMembersDialog
        workspaceId={membersWorkspaceId}
        onOpenChange={(open) => {
          if (!open) setMembersWorkspaceId(null);
        }}
      />
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onNewWorkspace={handleAddWorkspace}
      />
      <WhatsNewSheet
        open={whatsNewOpen}
        onOpenChange={setWhatsNewOpen}
      />
    </Sidebar>
  );
}
