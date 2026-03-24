"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crown, Shield, Users, Settings } from "lucide-react";
import { useWorkspaceStore, type Role } from "@/stores/workspace-store";
import { WorkspaceMembersDialog } from "./workspace-members-dialog";

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

export function MembersContent() {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const currentUser = useWorkspaceStore((s) => s.currentUser);
  const [membersWorkspaceId, setMembersWorkspaceId] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-6">
          {workspaces.map((ws) => {
            const totalCount = ws.members.length + ws.invites.length;
            return (
              <div key={ws.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{ws.name}</h3>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {ws.members.length} member{ws.members.length !== 1 && "s"}
                      {ws.invites.length > 0 && ` · ${ws.invites.length} pending`}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={() => setMembersWorkspaceId(ws.id)}
                  >
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    Manage
                  </Button>
                </div>

                {/* Compact member list */}
                <div className="mt-3 space-y-1">
                  {ws.members.map((member) => {
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
                        <span className="text-sm font-medium truncate flex-1">
                          {member.name}
                          {isCurrentUser && (
                            <span className="ml-1 text-xs text-muted-foreground font-normal">
                              (you)
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[200px]">
                          {member.email}
                        </span>
                        <RoleBadge role={member.role} />
                      </div>
                    );
                  })}
                  {ws.members.length === 0 && (
                    <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      No members yet
                    </div>
                  )}
                </div>

                <Separator className="mt-6" />
              </div>
            );
          })}
        </div>
      </div>

      <WorkspaceMembersDialog
        workspaceId={membersWorkspaceId}
        onOpenChange={(open) => {
          if (!open) setMembersWorkspaceId(null);
        }}
      />
    </div>
  );
}
