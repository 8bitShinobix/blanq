"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  MoreHorizontal,
  Shield,
  Crown,
  UserPlus,
  Clock,
  RefreshCw,
  X,
} from "lucide-react";
import { useWorkspaceStore, type Role } from "@/stores/workspace-store";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function RoleBadge({ role }: { role: Role }) {
  switch (role) {
    case "owner":
      return (
        <Badge variant="default" className="gap-1 text-xs font-normal">
          <Crown className="h-3 w-3" />
          Owner
        </Badge>
      );
    case "admin":
      return (
        <Badge variant="secondary" className="gap-1 text-xs font-normal">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      );
    case "member":
      return (
        <Badge variant="outline" className="gap-1 text-xs font-normal">
          Member
        </Badge>
      );
  }
}

interface WorkspaceMembersDialogProps {
  workspaceId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function WorkspaceMembersDialog({
  workspaceId,
  onOpenChange,
}: WorkspaceMembersDialogProps) {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const currentUser = useWorkspaceStore((s) => s.currentUser);
  const inviteMember = useWorkspaceStore((s) => s.inviteMember);
  const removeMember = useWorkspaceStore((s) => s.removeMember);
  const changeRole = useWorkspaceStore((s) => s.changeRole);
  const revokeInvite = useWorkspaceStore((s) => s.revokeInvite);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");

  const workspace = workspaces.find((ws) => ws.id === workspaceId);
  const open = !!workspace;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !workspaceId) return;
    inviteMember(workspaceId, email.trim(), role);
    setEmail("");
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setEmail("");
      setRole("member");
    }
    onOpenChange(v);
  };

  if (!workspace) {
    return (
      <Dialog open={false} onOpenChange={handleClose}>
        <DialogContent />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Members — {workspace.name}</DialogTitle>
        </DialogHeader>

        {/* Invite form */}
        <form onSubmit={handleInvite} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" size="sm" disabled={!email.trim()}>
            <UserPlus className="h-4 w-4 mr-1" />
            Invite
          </Button>
        </form>

        <Separator />

        {/* Members list */}
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {workspace.members.map((member) => {
            const isCurrentUser = currentUser?.id === member.id;
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-md px-2 py-1.5"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={member.image ?? undefined}
                    alt={member.name}
                  />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {member.name}
                    {isCurrentUser && (
                      <span className="ml-1 text-xs text-muted-foreground font-normal">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>
                <RoleBadge role={member.role} />
                {!isCurrentUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      {member.role !== "admin" && (
                        <DropdownMenuItem
                          onClick={() => changeRole(workspace.id, member.id, "admin")}
                        >
                          <Shield className="mr-2 h-3.5 w-3.5" />
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      {member.role !== "member" && (
                        <DropdownMenuItem
                          onClick={() => changeRole(workspace.id, member.id, "member")}
                        >
                          Make Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => removeMember(workspace.id, member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <X className="mr-2 h-3.5 w-3.5" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })}
        </div>

        {/* Pending invites */}
        {workspace.invites.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Pending invitations ({workspace.invites.length})
                </span>
              </div>
              <div className="space-y-1">
                {workspace.invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px]">
                        <Mail className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{invite.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {invite.sentAt}
                      </p>
                    </div>
                    <RoleBadge role={invite.role} />
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Resend"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => revokeInvite(workspace.id, invite.id)}
                        title="Revoke"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
