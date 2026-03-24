"use client";

import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Home,
  Users,
  Globe,
  Settings,
  FileText,
  Trash2,
  Plus,
  HelpCircle,
  Headphones,
  ArrowRight,
  FolderPlus,
  Sparkles,
  Map,
  MessageCircle,
  Gift,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { createFormAction } from "@/app/(dashboard)/forms/actions";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewWorkspace?: () => void;
}

const navigationItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Members", href: "/members", icon: Users },
  { label: "Domains", href: "/domains", icon: Globe },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Templates", href: "/templates", icon: FileText },
  { label: "What's new", href: "/changelog", icon: Sparkles },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Feature requests", href: "/feature-requests", icon: MessageCircle },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Trash", href: "/trash", icon: Trash2 },
];

const helpItems = [
  { label: "Help center", href: "/help", icon: HelpCircle },
  { label: "Contact support", href: "/support", icon: Headphones },
];

export function CommandPalette({
  open,
  onOpenChange,
  onNewWorkspace,
}: CommandPaletteProps) {
  const router = useRouter();
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const addFormToWorkspace = useWorkspaceStore((s) => s.addFormToWorkspace);

  const allForms = workspaces.flatMap((ws) =>
    ws.forms.map((form) => ({
      ...form,
      workspaceName: ws.name,
    }))
  );

  const runCommand = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search for forms and help articles"
      showCloseButton={false}
    >
      <CommandInput placeholder="Search for forms and help articles" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(async () => {
                const defaultWs = workspaces.find((ws) => ws.isDefault);
                const { id, slug } = await createFormAction(defaultWs?.id);
                if (defaultWs) {
                  addFormToWorkspace(defaultWs.id, { id, title: "Untitled", slug });
                }
                router.push(`/forms/${slug}`);
                router.refresh();
              })
            }
          >
            <Plus className="h-4 w-4" />
            <span>New form</span>
          </CommandItem>
          {onNewWorkspace && (
            <CommandItem
              onSelect={() => runCommand(onNewWorkspace)}
            >
              <FolderPlus className="h-4 w-4" />
              <span>New workspace</span>
            </CommandItem>
          )}
        </CommandGroup>

        {allForms.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Forms">
              {allForms.map((form) => (
                <CommandItem
                  key={form.id}
                  onSelect={() =>
                    runCommand(() => router.push(`/forms/${form.slug}`))
                  }
                >
                  <FileText className="h-4 w-4" />
                  <span>{form.title}</span>
                  <CommandShortcut>{form.workspaceName}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <ArrowRight className="h-4 w-4" />
              <span>Go to {item.label.toLowerCase()}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Help">
          {helpItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <ArrowRight className="h-4 w-4" />
              <span>Go to {item.label.toLowerCase()}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
