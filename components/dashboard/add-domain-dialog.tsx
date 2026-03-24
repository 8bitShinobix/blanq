"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface AddDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (domain: string) => void;
}

export function AddDomainDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddDomainDialogProps) {
  const [domain, setDomain] = useState("");

  useEffect(() => {
    if (open) setDomain("");
  }, [open]);

  const handleSubmit = () => {
    const trimmed = domain.trim().toLowerCase();
    if (!trimmed) return;
    onSubmit(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect domain</DialogTitle>
          <DialogDescription>
            Enter a domain or subdomain you own to host your forms under a custom URL.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="forms.yourdomain.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          You&apos;ll need to add DNS records at your domain provider to verify ownership.
        </p>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!domain.trim()}>
            Connect domain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
