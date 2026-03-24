"use client";

import { useState } from "react";
import { Check, Copy, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReferralInviteProps {
  inviteLink: string;
}

export function ReferralInvite({ inviteLink }: ReferralInviteProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareLinks = [
    {
      label: "X",
      icon: () => (
        <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(`Check out Blanq — the modern form builder! Use my link for 20% off: ${inviteLink}`)}`,
    },
    {
      label: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent("Try Blanq — modern forms, made simple")}&body=${encodeURIComponent(`Hey! I've been using Blanq for building forms and it's great. Use my referral link to get 20% off:\n\n${inviteLink}`)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}`,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Invite link row */}
      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={inviteLink}
          className="h-10 flex-1 bg-grey-100/50 text-sm"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <Button onClick={handleCopy} size="sm" className="h-10 shrink-0 gap-1.5 px-4">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Share row */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">or share via</span>
        <TooltipProvider>
          {shareLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Tooltip key={link.label}>
                <TooltipTrigger asChild>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-grey-100 hover:text-foreground"
                  >
                    <Icon className="size-3.5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom">{link.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
