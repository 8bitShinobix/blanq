"use client";

import { useState, useMemo } from "react";
import { SearchIcon, ShuffleIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EMOJI_CATEGORIES = {
  People: [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊",
    "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜",
    "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🫡", "🤐", "🤨", "😐", "😑",
    "😶", "🫥", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴",
    "😷", "🤒", "🤕", "🤢", "🤮", "🥵", "🥶", "😱", "😨", "😰", "😥", "😢",
  ],
  Nature: [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
    "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗",
    "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", "🪲", "🪳",
    "🌸", "🌺", "🌹", "🌷", "🌻", "🌼", "💐", "🌾", "🍀", "☘️", "🌿", "🪴",
  ],
  Food: [
    "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭",
    "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽",
    "🥕", "🧄", "🧅", "🥔", "🍠", "🫘", "🥐", "🍞", "🥖", "🥨", "🧀", "🥚",
    "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟",
  ],
  Objects: [
    "⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀",
    "🎥", "📷", "📸", "📹", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️",
    "⏰", "🕐", "⏱️", "⏲️", "🔔", "📣", "📢", "🔊", "🔉", "🔈", "🔇", "📦",
    "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖊️", "🖋️", "📝", "💼", "📁", "📂",
  ],
  Symbols: [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕",
    "💞", "💓", "💗", "💖", "💘", "💝", "⭐", "🌟", "✨", "⚡", "🔥", "💫",
    "🎯", "♠️", "♥️", "♦️", "♣️", "🃏", "🀄", "🎴", "✅", "❌", "❓", "❗",
    "💯", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔶", "🔷",
  ],
};

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (emoji: string) => void;
  onRemove?: () => void;
  hasIcon?: boolean;
  children: React.ReactNode;
}

export function IconPicker({
  open,
  onOpenChange,
  onSelect,
  onRemove,
  hasIcon,
  children,
}: IconPickerProps) {
  const [filter, setFilter] = useState("");

  const filteredCategories = useMemo(() => {
    if (!filter) return EMOJI_CATEGORIES;
    // Simple filter: just show all emojis that roughly match
    // In reality, you'd have emoji keywords for proper search
    return EMOJI_CATEGORIES;
  }, [filter]);

  const handleRandom = () => {
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    const random = allEmojis[Math.floor(Math.random() * allEmojis.length)];
    onSelect(random);
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        sideOffset={8}
      >
        <Tabs defaultValue="emoji" className="w-full">
          <div className="flex items-center justify-between px-3 pt-2">
            <TabsList variant="line" className="h-8 p-0 gap-0">
              <TabsTrigger value="emoji" className="px-3 text-sm">
                Emoji
              </TabsTrigger>
            </TabsList>
            {hasIcon && onRemove && (
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

          <TabsContent value="emoji" className="mt-0">
            {/* Search bar */}
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={handleRandom}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Random emoji"
              >
                <ShuffleIcon className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Emoji grid */}
            <div className="max-h-64 overflow-y-auto p-2">
              {Object.entries(filteredCategories).map(([category, emojis]) => (
                <div key={category} className="mb-3">
                  <h4 className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">
                    {category}
                  </h4>
                  <div className="grid grid-cols-10 gap-0.5">
                    {emojis.map((emoji, i) => (
                      <button
                        key={`${emoji}-${i}`}
                        onClick={() => {
                          onSelect(emoji);
                          onOpenChange(false);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-muted"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
