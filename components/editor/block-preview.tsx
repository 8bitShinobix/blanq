"use client";

import { useCallback } from "react";
import {
  Equal,
  Square,
  ChevronDown,
  CheckCheck,
  X,
  Plus,
  Hash,
  AtSign,
  Phone,
  Link,
  Calendar,
  Clock,
  Upload,
  Star,
  CreditCard,
  ChevronsUpDown,
  ArrowRight,
  HelpCircle,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCustomizationStore } from "@/stores/customization-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BlockType } from "./types";

interface BlockPreviewProps {
  type: BlockType;
  placeholder?: string;
  onPlaceholderChange?: (value: string) => void;
  options?: string[];
  onOptionsChange?: (options: string[]) => void;
}

function LetterBadge({ index }: { index: number }) {
  const letter = String.fromCharCode(65 + index);
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted-foreground/20 text-xs font-semibold text-muted-foreground">
      {letter}
    </span>
  );
}

function OptionList({
  options,
  onOptionsChange,
  icon,
  variant = "default",
  useLetterBadge = false,
}: {
  options: string[];
  onOptionsChange?: (options: string[]) => void;
  icon?: React.ReactNode;
  variant?: "default" | "checkbox" | "dropdown" | "multi_select" | "ranking";
  useLetterBadge?: boolean;
}) {
  const updateOption = useCallback(
    (index: number, value: string) => {
      const next = [...options];
      next[index] = value;
      onOptionsChange?.(next);
    },
    [options, onOptionsChange]
  );

  const removeOption = useCallback(
    (index: number) => {
      if (options.length <= 1) return;
      onOptionsChange?.(options.filter((_, i) => i !== index));
    },
    [options, onOptionsChange]
  );

  const addOption = useCallback(() => {
    onOptionsChange?.([...options, `Option ${options.length + 1}`]);
  }, [options, onOptionsChange]);

  const pillStyles = {
    default: "border border-border bg-background",
    checkbox: "border border-border bg-background",
    dropdown: "border border-border bg-background",
    multi_select: "border border-orange-200 bg-orange-50 text-orange-700",
    ranking: "border border-border bg-background",
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      {options.map((option, index) => (
        <div key={index} className="group/option flex items-center gap-2">
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${pillStyles[variant]}`}
          >
            {useLetterBadge ? (
              <LetterBadge index={index} />
            ) : (
              <span className="shrink-0 text-muted-foreground">{icon}</span>
            )}
            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="bg-transparent text-sm focus:outline-none"
              style={{ width: `${Math.max(option.length, 6)}ch` }}
            />
          </div>
          {options.length > 1 && (
            <button
              onClick={() => removeOption(index)}
              className="rounded p-0.5 text-muted-foreground/40 opacity-0 transition-opacity hover:text-foreground group-hover/option:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addOption}
        className="flex w-fit items-center gap-2 rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground/40 transition-colors hover:border-border hover:text-muted-foreground"
      >
        {useLetterBadge ? (
          <LetterBadge index={options.length} />
        ) : (
          <Plus className="h-3.5 w-3.5" />
        )}
        Add option
      </button>
    </div>
  );
}

export function BlockPreview({
  type,
  placeholder = "",
  onPlaceholderChange,
  options = ["Option 1"],
  onOptionsChange,
}: BlockPreviewProps) {
  const custom = useCustomizationStore((s) => s.state);
  const inputStyle: React.CSSProperties = {
    backgroundColor: custom.inputBg,
    borderColor: custom.inputBorder,
    borderWidth: `${custom.inputBorderWidth}px`,
    borderRadius: `${custom.inputBorderRadius}px`,
    height: `${custom.inputHeight}px`,
    padding: `0 ${custom.inputHPadding}px`,
    color: custom.textColor,
  };
  const placeholderClass = "placeholder:text-[var(--editor-placeholder)]";

  switch (type) {
    case "short_answer":
      return (
        <div className="relative mt-2">
          <Input
            value={placeholder}
            onChange={(e) => onPlaceholderChange?.(e.target.value)}
            placeholder="Type placeholder text"
            className={`pr-10 ${placeholderClass}`}
            style={inputStyle}
          />
          <Equal className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      );

    case "long_answer":
      return (
        <div className="mt-2">
          <Textarea
            value={placeholder}
            onChange={(e) => onPlaceholderChange?.(e.target.value)}
            placeholder="Type placeholder text"
            rows={4}
            className={`resize-none ${placeholderClass}`}
            style={{ ...inputStyle, height: "auto" }}
          />
        </div>
      );

    case "multiple_choice":
      return (
        <OptionList
          options={options}
          onOptionsChange={onOptionsChange}
          variant="default"
          useLetterBadge
        />
      );

    case "checkboxes":
      return (
        <OptionList
          options={options}
          onOptionsChange={onOptionsChange}
          icon={<Square className="h-3.5 w-3.5" strokeWidth={1.5} />}
          variant="checkbox"
        />
      );

    case "dropdown":
      return (
        <OptionList
          options={options}
          onOptionsChange={onOptionsChange}
          icon={<ChevronDown className="h-3.5 w-3.5" />}
          variant="dropdown"
        />
      );

    case "multi_select":
      return (
        <OptionList
          options={options}
          onOptionsChange={onOptionsChange}
          icon={<CheckCheck className="h-3.5 w-3.5" />}
          variant="multi_select"
        />
      );

    case "number":
      return (
        <div className="relative mt-2">
          <Input
            value={placeholder}
            onChange={(e) => onPlaceholderChange?.(e.target.value)}
            placeholder="Type placeholder text"
            className={`pr-10 ${placeholderClass}`}
            style={inputStyle}
          />
          <Hash className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      );

    case "email":
      return (
        <div className="relative mt-2">
          <Input
            value={placeholder}
            onChange={(e) => onPlaceholderChange?.(e.target.value)}
            placeholder="Type placeholder text"
            className={`pr-10 ${placeholderClass}`}
            style={inputStyle}
          />
          <AtSign className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      );

    case "phone":
      return (
        <div className="relative mt-2">
          <Input
            value={placeholder}
            onChange={(e) => onPlaceholderChange?.(e.target.value)}
            placeholder="Type placeholder text"
            className={`pr-10 ${placeholderClass}`}
            style={inputStyle}
          />
          <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      );

    case "link":
      return (
        <div className="relative mt-2">
          <Input
            value={placeholder}
            onChange={(e) => onPlaceholderChange?.(e.target.value)}
            placeholder="Type placeholder text"
            className={`pr-10 ${placeholderClass}`}
            style={inputStyle}
          />
          <Link className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      );

    case "file_upload":
      return (
        <div className="mt-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-4 w-4" />
            Click to choose a file or drag here
          </div>
          <p className="text-xs text-muted-foreground/60">Size limit: 10 MB</p>
        </div>
      );

    case "date":
      return (
        <div className="relative mt-2">
          <Input
            value={placeholder}
            onChange={(e) => onPlaceholderChange?.(e.target.value)}
            placeholder="Type placeholder text"
            className={`pr-10 ${placeholderClass}`}
            style={inputStyle}
          />
          <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      );

    case "time":
      return (
        <div className="relative mt-2">
          <Input
            value={placeholder}
            onChange={(e) => onPlaceholderChange?.(e.target.value)}
            placeholder="Type placeholder text"
            className={`pr-10 ${placeholderClass}`}
            style={inputStyle}
          />
          <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      );

    case "linear_scale":
      return (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={i}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-sm text-foreground"
            >
              {i}
            </div>
          ))}
        </div>
      );

    case "matrix":
      return (
        <div className="mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/30" />
                {["Column 1", "Column 2", "Column 3"].map((col) => (
                  <TableHead
                    key={col}
                    className="bg-muted/30 text-center font-normal text-muted-foreground"
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {["Row 1", "Row 2", "Row 3"].map((row) => (
                <TableRow key={row}>
                  <TableCell className="text-muted-foreground">
                    {row}
                  </TableCell>
                  {[1, 2, 3].map((col) => (
                    <TableCell key={col} className="text-center">
                      <div className="mx-auto h-4 w-4 rounded-full border border-border" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );

    case "rating":
      return (
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className="h-8 w-8 text-muted-foreground/30"
              strokeWidth={1.5}
            />
          ))}
        </div>
      );

    case "payment":
      return (
        <div className="mt-2 rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">
            Collect and receive payments directly on your bank account powered by
            Stripe.
          </p>
          <div className="mt-3">
            <span className="text-sm font-semibold">Price</span>
            <Input placeholder="Value" className={`mt-1 ${placeholderClass}`} style={inputStyle} />
          </div>
          <div className="mt-3">
            <span className="text-sm font-semibold">Currency</span>
            <div className="mt-1 flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              USD — United States Dollar
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background">
            Connect with Stripe
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            Learn about collecting payments
          </div>
        </div>
      );

    case "signature":
      return (
        <div className="relative mt-2 flex h-52 flex-col items-center justify-end rounded-lg border border-dashed border-border px-6 pb-4">
          <button className="absolute right-3 top-3 text-sm text-muted-foreground hover:text-foreground">
            Clear
          </button>
          <div className="mb-2 h-px w-full max-w-xs bg-border" />
          <span className="text-sm text-muted-foreground/60">Signature</span>
        </div>
      );

    case "ranking":
      return (
        <OptionList
          options={options}
          onOptionsChange={onOptionsChange}
          icon={<ChevronsUpDown className="h-3.5 w-3.5" />}
          variant="ranking"
        />
      );

    case "wallet_connect":
      return (
        <div className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-8">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Connect Wallet</span>
        </div>
      );

    default:
      return null;
  }
}
