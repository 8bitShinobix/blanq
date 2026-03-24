"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link, Search } from "lucide-react";
import type { BlockType } from "./types";

interface EmbedDialogProps {
  type: BlockType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (url: string) => void;
}

const EMBED_CONFIG: Record<
  string,
  { title: string; placeholder: string; buttonLabel: string; helperText: string }
> = {
  video: {
    title: "Embed link",
    placeholder: "Paste the video link...",
    buttonLabel: "Embed video",
    helperText: "Works with YouTube, Vimeo, Loom, MP4s and more",
  },
  audio: {
    title: "Embed link",
    placeholder: "Paste the audio link...",
    buttonLabel: "Embed audio",
    helperText: "Works with SoundCloud, Spotify, MP3s and more",
  },
  embed: {
    title: "Embed link",
    placeholder: "Paste the link...",
    buttonLabel: "Embed",
    helperText: "Works with 2000+ apps and websites",
  },
};

function ImageDialog({ onSubmit }: { onSubmit?: (url: string) => void }) {
  const [url, setUrl] = useState("");

  return (
    <Tabs defaultValue="upload">
      <TabsList variant="line">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="link">Link</TabsTrigger>
        <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-4">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-12">
          <Upload className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">
            Click to choose a file or drag here
          </p>
          <p className="text-xs text-muted-foreground/60">Size limit: 10 MB</p>
        </div>
      </TabsContent>

      <TabsContent value="link" className="mt-4">
        <div className="space-y-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste the image link..."
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground/60">
              Works with any image URL
            </p>
            <Button
              size="sm"
              onClick={() => {
                if (url.trim()) onSubmit?.(url.trim());
              }}
              disabled={!url.trim()}
            >
              Embed image
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="unsplash" className="mt-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
            <Input placeholder="Search Unsplash..." className="pl-9" />
          </div>
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground/40">
              Search for photos above
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function LinkEmbedDialog({
  config,
  onSubmit,
}: {
  config: (typeof EMBED_CONFIG)[string];
  onSubmit?: (url: string) => void;
}) {
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-3">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={config.placeholder}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground/60">{config.helperText}</p>
        <Button
          size="sm"
          onClick={() => {
            if (url.trim()) onSubmit?.(url.trim());
          }}
          disabled={!url.trim()}
        >
          {config.buttonLabel}
        </Button>
      </div>
    </div>
  );
}

export function EmbedDialog({
  type,
  open,
  onOpenChange,
  onSubmit,
}: EmbedDialogProps) {
  const config = EMBED_CONFIG[type];
  const title = type === "image" ? "Add an image" : config?.title || "Embed link";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {type === "image" ? (
          <ImageDialog onSubmit={onSubmit} />
        ) : config ? (
          <LinkEmbedDialog config={config} onSubmit={onSubmit} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
