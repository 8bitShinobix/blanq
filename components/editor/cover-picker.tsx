"use client";

import { useState } from "react";
import { LinkIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const GRADIENTS = [
  { id: "amber", className: "bg-gradient-to-br from-amber-300 to-amber-500" },
  { id: "sky", className: "bg-gradient-to-br from-sky-300 to-sky-500" },
  { id: "cream", className: "bg-gradient-to-br from-orange-100 to-amber-50" },
  { id: "teal", className: "bg-gradient-to-br from-teal-200 to-cyan-300" },
  { id: "pink", className: "bg-gradient-to-br from-pink-400 to-rose-500" },
  { id: "coral", className: "bg-gradient-to-br from-orange-300 to-red-400" },
  { id: "purple", className: "bg-gradient-to-br from-violet-300 to-purple-400" },
  { id: "grey", className: "bg-gradient-to-br from-slate-300 to-zinc-400" },
];

const SOLID_COLORS = [
  { id: "red", className: "bg-red-400" },
  { id: "orange", className: "bg-orange-400" },
  { id: "amber", className: "bg-amber-400" },
  { id: "green", className: "bg-green-400" },
  { id: "teal", className: "bg-teal-400" },
  { id: "blue", className: "bg-blue-400" },
  { id: "indigo", className: "bg-indigo-400" },
  { id: "violet", className: "bg-violet-400" },
  { id: "pink", className: "bg-pink-400" },
  { id: "slate", className: "bg-slate-400" },
];

// CSS-only gradient/solid cover values (stored as CSS class names)
type CoverValue = {
  type: "gradient" | "solid" | "url";
  value: string; // className for gradient/solid, URL for url
  positionY?: number; // 0–100 vertical object-position %, default 50
};

interface CoverPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (cover: CoverValue) => void;
  onRemove?: () => void;
  hasCover?: boolean;
  children: React.ReactNode;
}

export function CoverPicker({
  open,
  onOpenChange,
  onSelect,
  onRemove,
  hasCover,
  children,
}: CoverPickerProps) {
  const [linkUrl, setLinkUrl] = useState("");

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-[420px] p-0"
        align="start"
        sideOffset={8}
      >
        <Tabs defaultValue="gallery" className="w-full">
          <div className="flex items-center justify-between px-3 pt-2">
            <TabsList variant="line" className="h-8 p-0 gap-0">
              <TabsTrigger value="gallery" className="px-3 text-sm">
                Gallery
              </TabsTrigger>
              <TabsTrigger value="link" className="px-3 text-sm">
                Link
              </TabsTrigger>
            </TabsList>
            {hasCover && onRemove && (
              <button
                onClick={() => {
                  onRemove();
                  onOpenChange(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-1"
              >
                Remove
              </button>
            )}
          </div>

          <TabsContent value="gallery" className="mt-0">
            <div className="max-h-72 overflow-y-auto p-3 space-y-4">
              {/* Gradients */}
              <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground">
                  Color & Gradient
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {GRADIENTS.map((gradient) => (
                    <button
                      key={gradient.id}
                      onClick={() => {
                        onSelect({
                          type: "gradient",
                          value: gradient.className,
                        });
                        onOpenChange(false);
                      }}
                      className={`h-16 rounded-lg ${gradient.className} transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2`}
                    />
                  ))}
                </div>
              </div>

              {/* Solid colors */}
              <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground">
                  Solid Colors
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {SOLID_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        onSelect({
                          type: "solid",
                          value: color.className,
                        });
                        onOpenChange(false);
                      }}
                      className={`h-10 rounded-lg ${color.className} transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-0">
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Button
                size="sm"
                className="w-full"
                disabled={!linkUrl}
                onClick={() => {
                  if (linkUrl) {
                    onSelect({ type: "url", value: linkUrl });
                    onOpenChange(false);
                    setLinkUrl("");
                  }
                }}
              >
                Submit
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Works with any image URL from the web.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

export type { CoverValue };
