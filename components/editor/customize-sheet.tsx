"use client";

import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  MoveHorizontal,
  ArrowDownToLine,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoveRight,
} from "lucide-react";
import { useCustomizationStore } from "@/stores/customization-store";
import { useFormContentStore } from "@/stores/form-content-store";
import { IconPicker } from "./icon-picker";
import { CoverPicker } from "./cover-picker";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

function PxInput({
  label,
  value,
  onChange,
  suffix = "px",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div>
      {label && (
        <Label className="mb-1.5 block text-xs text-muted-foreground">
          {label}
        </Label>
      )}
      <div className="flex items-center rounded-md border border-border">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-1.5 text-sm focus:outline-none"
        />
        {suffix && (
          <span className="pr-3 text-xs text-muted-foreground/60">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold">{children}</h3>;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function getWidthMode(value: string): "auto" | "fixed" | "full" {
  if (value === "auto") return "auto";
  if (value === "full") return "full";
  return "fixed";
}

function WidthToggle({
  active,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded border p-1 ${
        active
          ? "border-foreground bg-muted text-foreground"
          : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

export function CustomizeSheet() {
  const state = useCustomizationStore((s) => s.state);
  const set = useCustomizationStore((s) => s.set);
  const icon = useFormContentStore((s) => s.icon);
  const setIcon = useFormContentStore((s) => s.setIcon);
  const cover = useFormContentStore((s) => s.cover);
  const setCover = useFormContentStore((s) => s.setCover);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Customize
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton
        className="w-[400px] p-0 sm:max-w-[400px]"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-lg">Customize</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="px-5 py-5">
            {/* ─── Theme & Font ─── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  Theme
                </Label>
                <Select
                  value={state.theme}
                  onValueChange={(v) => set("theme", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  Font
                </Label>
                <Select
                  value={state.font}
                  onValueChange={(v) => set("font", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-sans">Google Sans</SelectItem>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="dm-sans">DM Sans</SelectItem>
                    <SelectItem value="outfit">Outfit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-5" />

            {/* ─── Colors ─── */}
            <div className="space-y-3">
              <SectionHeading>Colors</SectionHeading>
              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                  label="Background"
                  value={state.bgColor}
                  onChange={(v) => set("bgColor", v)}
                />
                <ColorInput
                  label="Text"
                  value={state.textColor}
                  onChange={(v) => set("textColor", v)}
                />
                <ColorInput
                  label="Button background"
                  value={state.btnBg}
                  onChange={(v) => set("btnBg", v)}
                />
                <ColorInput
                  label="Button text"
                  value={state.btnText}
                  onChange={(v) => set("btnText", v)}
                />
              </div>
              <ColorInput
                label="Accent"
                value={state.accentColor}
                onChange={(v) => set("accentColor", v)}
              />
            </div>

            <Separator className="my-5" />

            {/* ─── Layout ─── */}
            <div className="space-y-3">
              <SectionHeading>Layout</SectionHeading>
              <div className="grid grid-cols-2 gap-3">
                <PxInput
                  label="Page width"
                  value={state.pageWidth}
                  onChange={(v) => set("pageWidth", v)}
                />
                <PxInput
                  label="Base font size"
                  value={state.baseFontSize}
                  onChange={(v) => set("baseFontSize", v)}
                />
              </div>

              {/* Logo */}
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  Logo
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  <IconPicker
                    open={iconPickerOpen}
                    onOpenChange={setIconPickerOpen}
                    onSelect={(emoji) => setIcon(emoji)}
                    onRemove={() => setIcon(null)}
                    hasIcon={!!icon}
                  >
                    <button className="flex h-full items-center justify-center rounded-md border border-border py-1.5 transition-colors hover:bg-muted">
                      {icon ? (
                        <span className="text-lg">{icon}</span>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-border" />
                      )}
                    </button>
                  </IconPicker>
                  <PxInput
                    label=""
                    value={state.logoWidth}
                    onChange={(v) => set("logoWidth", v)}
                  />
                  <PxInput
                    label=""
                    value={state.logoHeight}
                    onChange={(v) => set("logoHeight", v)}
                  />
                  <PxInput
                    label=""
                    value={state.logoRadius}
                    onChange={(v) => set("logoRadius", v)}
                  />
                </div>
                <div className="mt-1 grid grid-cols-4 gap-2 text-[10px] text-muted-foreground/60">
                  <span />
                  <span>Width</span>
                  <span>Height</span>
                  <span>Corner radius</span>
                </div>
              </div>

              {/* Cover */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">
                    Cover
                  </Label>
                  <CoverPicker
                    open={coverPickerOpen}
                    onOpenChange={setCoverPickerOpen}
                    onSelect={(c) => setCover(c)}
                    onRemove={() => setCover(null)}
                    hasCover={!!cover}
                  >
                    <button className="h-9 w-full rounded-md border border-border transition-colors hover:opacity-80 overflow-hidden">
                      {cover ? (
                        cover.type === "url" ? (
                          <img src={cover.value} alt="Cover" className="h-full w-full object-cover" />
                        ) : (
                          <div className={`h-full w-full ${cover.value}`} />
                        )
                      ) : (
                        <div className="h-full w-full bg-orange-100" />
                      )}
                    </button>
                  </CoverPicker>
                </div>
                <PxInput
                  label="Height"
                  value={state.coverHeight}
                  suffix="%"
                  onChange={(v) => set("coverHeight", v)}
                />
              </div>
            </div>

            <Separator className="my-5" />

            {/* ─── Inputs ─── */}
            <div className="space-y-3">
              <SectionHeading>Inputs</SectionHeading>

              {(() => {
                const mode = state.inputWidth === "full" ? "full" : "fixed";
                return (
                  <div className={`grid gap-2 ${mode === "fixed" ? "grid-cols-[auto_1fr_1fr]" : "grid-cols-[auto_1fr]"}`}>
                    <div className="flex items-end gap-1 pb-1.5">
                      <WidthToggle
                        active={mode === "fixed"}
                        icon={MoveHorizontal}
                        onClick={() => set("inputWidth", "320")}
                      />
                      <WidthToggle
                        active={mode === "full"}
                        icon={ArrowDownToLine}
                        onClick={() => set("inputWidth", "full")}
                      />
                    </div>
                    {mode === "fixed" && (
                      <PxInput
                        label="Width"
                        value={state.inputWidth}
                        onChange={(v) => set("inputWidth", v)}
                      />
                    )}
                    <PxInput
                      label="Height"
                      value={state.inputHeight}
                      onChange={(v) => set("inputHeight", v)}
                    />
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                  label="Background"
                  value={state.inputBg}
                  onChange={(v) => set("inputBg", v)}
                />
                <ColorInput
                  label="Placeholder"
                  value={state.inputPlaceholder}
                  onChange={(v) => set("inputPlaceholder", v)}
                />
              </div>

              <div className="grid grid-cols-[1fr_0.6fr_0.6fr] gap-2">
                <ColorInput
                  label="Border"
                  value={state.inputBorder}
                  onChange={(v) => set("inputBorder", v)}
                />
                <PxInput
                  label="Width"
                  value={state.inputBorderWidth}
                  onChange={(v) => set("inputBorderWidth", v)}
                />
                <PxInput
                  label="Radius"
                  value={state.inputBorderRadius}
                  onChange={(v) => set("inputBorderRadius", v)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PxInput
                  label="Margin bottom"
                  value={state.inputMarginBottom}
                  onChange={(v) => set("inputMarginBottom", v)}
                />
                <PxInput
                  label="Horizontal padding"
                  value={state.inputHPadding}
                  onChange={(v) => set("inputHPadding", v)}
                />
              </div>
            </div>

            <Separator className="my-5" />

            {/* ─── Buttons ─── */}
            <div className="space-y-3">
              <SectionHeading>Buttons</SectionHeading>

              {(() => {
                const mode = getWidthMode(state.btnWidth);
                return (
                  <div className={`grid gap-2 ${mode === "fixed" ? "grid-cols-[auto_1fr_1fr]" : "grid-cols-[auto_1fr]"}`}>
                    <div className="flex items-end gap-1 pb-1.5">
                      <WidthToggle
                        active={mode === "auto"}
                        icon={MoveRight}
                        onClick={() => set("btnWidth", "auto")}
                      />
                      <WidthToggle
                        active={mode === "fixed"}
                        icon={MoveHorizontal}
                        onClick={() => set("btnWidth", "200")}
                      />
                      <WidthToggle
                        active={mode === "full"}
                        icon={ArrowDownToLine}
                        onClick={() => set("btnWidth", "full")}
                      />
                    </div>
                    {mode === "fixed" && (
                      <PxInput
                        label="Width"
                        value={state.btnWidth}
                        onChange={(v) => set("btnWidth", v)}
                      />
                    )}
                    <PxInput
                      label="Height"
                      value={state.btnHeight}
                      onChange={(v) => set("btnHeight", v)}
                    />
                  </div>
                );
              })()}

              <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">
                    Alignment
                  </Label>
                  <div className="flex gap-1">
                    {(
                      [
                        ["left", AlignLeft],
                        ["center", AlignCenter],
                        ["right", AlignRight],
                      ] as const
                    ).map(([align, Icon]) => (
                      <button
                        key={align}
                        onClick={() => set("btnAlignment", align)}
                        className={`rounded border p-1.5 ${
                          state.btnAlignment === align
                            ? "border-foreground bg-muted text-foreground"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
                <PxInput
                  label="Font size"
                  value={state.btnFontSize}
                  onChange={(v) => set("btnFontSize", v)}
                />
                <PxInput
                  label="Corner radius"
                  value={state.btnCornerRadius}
                  onChange={(v) => set("btnCornerRadius", v)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                  label="Background"
                  value={state.btnBg}
                  onChange={(v) => set("btnBg", v)}
                />
                <ColorInput
                  label="Text"
                  value={state.btnText}
                  onChange={(v) => set("btnText", v)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PxInput
                  label="Vertical margin"
                  value={state.btnVMargin}
                  onChange={(v) => set("btnVMargin", v)}
                />
                <PxInput
                  label="Horizontal padding"
                  value={state.btnHPadding}
                  onChange={(v) => set("btnHPadding", v)}
                />
              </div>
            </div>

            <div className="h-8" />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
