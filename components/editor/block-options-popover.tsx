"use client";

import { useCallback, useState } from "react";
import {
  Trash2,
  Copy,
  EyeOff,
  GitBranch,
  Pencil,
  GripHorizontal,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  BLOCK_TYPES,
  QUESTION_BLOCK_TYPES,
  type Block,
} from "./types";
import { BLOCK_ICON_MAP } from "./icon-map";
import { COUNTRY_CODES } from "./country-codes";

// ── Type groupings ──────────────────────────────────────────────

const TEXT_TYPES = new Set(["short_answer", "long_answer"]);
const CHOICE_TYPES = new Set(["checkboxes", "dropdown", "multi_select"]);
const SIMPLE_TYPES = new Set(["link", "time", "wallet_connect"]);

// ── Main component ──────────────────────────────────────────────

interface BlockOptionsPopoverProps {
  block: Block;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  children: React.ReactNode;
}

export function BlockOptionsPopover({
  block,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  onDuplicate,
  children,
}: BlockOptionsPopoverProps) {
  const blockMeta = BLOCK_TYPES.find((b) => b.type === block.type);
  const isQuestion = QUESTION_BLOCK_TYPES.has(block.type);

  const headerLabel = block.content
    ? block.content
    : `Untitled ${blockMeta?.label?.toLowerCase() || block.type.replace(/_/g, " ")} field`;

  const BlockIcon = blockMeta ? BLOCK_ICON_MAP[blockMeta.icon] : null;

  const update = useCallback(
    (updates: Partial<Block>) => onUpdate(block.id, updates),
    [block.id, onUpdate]
  );

  const handleAction = useCallback(
    (action: () => void) => {
      action();
      onOpenChange(false);
    },
    [onOpenChange]
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="left"
        align="start"
        sideOffset={8}
        className="w-64 max-h-[70vh] overflow-y-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          {BlockIcon ? (
            <BlockIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <GripHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="flex-1 truncate text-sm font-medium">
            {headerLabel}
          </span>
          <button className="rounded p-0.5 text-muted-foreground hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Type-specific settings */}
        {isQuestion && (
          <>
            <Separator />
            <div className="space-y-0.5 px-3 py-2">
              {renderSettings(block, update)}
            </div>
          </>
        )}

        {/* Action items */}
        <Separator />
        <div className="py-1">
          <ActionItem
            icon={Trash2}
            label="Delete"
            variant="destructive"
            onClick={() => handleAction(() => onDelete(block.id))}
          />
          <ActionItem
            icon={Copy}
            label="Duplicate"
            onClick={() => handleAction(() => onDuplicate(block.id))}
          />
          <ActionItem
            icon={EyeOff}
            label={block.hidden ? "Show" : "Hide"}
            onClick={() =>
              handleAction(() =>
                onUpdate(block.id, { hidden: !block.hidden })
              )
            }
          />
          <ActionItem
            icon={GitBranch}
            label="Add conditional logic"
            onClick={() => onOpenChange(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── Settings renderer per block type ────────────────────────────

function renderSettings(
  block: Block,
  update: (updates: Partial<Block>) => void
) {
  const type = block.type;

  // ── Short answer / Long answer ──
  if (TEXT_TYPES.has(type)) {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithTextInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <ToggleWithInput
          label="Min characters"
          enabled={block.minChars !== undefined}
          value={block.minChars ?? 0}
          onToggle={() =>
            update({ minChars: block.minChars !== undefined ? undefined : 0 })
          }
          onChange={(v) => update({ minChars: v })}
        />
        <ToggleWithInput
          label="Max characters"
          enabled={block.maxChars !== undefined}
          value={block.maxChars ?? 255}
          onToggle={() =>
            update({ maxChars: block.maxChars !== undefined ? undefined : 255 })
          }
          onChange={(v) => update({ maxChars: v })}
        />
      </>
    );
  }

  // ── Multiple choice ──
  if (type === "multiple_choice") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithSelectInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          options={block.options ?? []}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <ToggleRow
          label={`"Other" option`}
          checked={block.otherOption === true}
          onCheckedChange={() => update({ otherOption: !block.otherOption })}
        />
        <ToggleRow
          label="Randomize options"
          checked={block.randomizeOptions === true}
          onCheckedChange={() => update({ randomizeOptions: !block.randomizeOptions })}
        />
        <ToggleRow
          label="Multiple selection"
          checked={block.multipleSelection === true}
          onCheckedChange={() => update({ multipleSelection: !block.multipleSelection })}
        />
        <SelectRow
          label="Badge"
          value={block.badge ?? "None"}
          options={["None", "Letters", "Numbers"]}
          onChange={(v) => update({ badge: v })}
        />
        <ToggleRow
          label="Color-code options"
          checked={block.colorCodeOptions === true}
          onCheckedChange={() => update({ colorCodeOptions: !block.colorCodeOptions })}
        />
      </>
    );
  }

  // ── Choice types (checkboxes, dropdown, multi_select) ──
  if (CHOICE_TYPES.has(type)) {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithSelectInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          options={block.options ?? []}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <ToggleRow
          label={`"Other" option`}
          checked={block.otherOption === true}
          onCheckedChange={() => update({ otherOption: !block.otherOption })}
        />
        <ToggleRow
          label="Randomize options"
          checked={block.randomizeOptions === true}
          onCheckedChange={() => update({ randomizeOptions: !block.randomizeOptions })}
        />
        <ToggleWithInput
          label="Min choices"
          enabled={block.minChoices !== undefined}
          value={block.minChoices ?? 1}
          onToggle={() =>
            update({ minChoices: block.minChoices !== undefined ? undefined : 1 })
          }
          onChange={(v) => update({ minChoices: v })}
        />
        <ToggleWithInput
          label="Max choices"
          enabled={block.maxChoices !== undefined}
          value={block.maxChoices ?? 5}
          onToggle={() =>
            update({ maxChoices: block.maxChoices !== undefined ? undefined : 5 })
          }
          onChange={(v) => update({ maxChoices: v })}
        />
      </>
    );
  }

  // ── Number ──
  if (type === "number") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithTextInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <SelectRow
          label="Format"
          value={block.numberFormat ?? "1234.56"}
          options={["1234.56", "1,234.56", "1.234,56"]}
          onChange={(v) => update({ numberFormat: v })}
        />
        <ToggleWithInput
          label="Min number"
          enabled={block.minNumber !== undefined}
          value={block.minNumber ?? 0}
          onToggle={() =>
            update({ minNumber: block.minNumber !== undefined ? undefined : 0 })
          }
          onChange={(v) => update({ minNumber: v })}
        />
        <ToggleWithInput
          label="Max number"
          enabled={block.maxNumber !== undefined}
          value={block.maxNumber ?? 100}
          onToggle={() =>
            update({ maxNumber: block.maxNumber !== undefined ? undefined : 100 })
          }
          onChange={(v) => update({ maxNumber: v })}
        />
      </>
    );
  }

  // ── Email ──
  if (type === "email") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithTextInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <div className="flex items-center justify-between py-1.5">
          <span className="flex items-center gap-1.5 text-sm">
            Verify email
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              Business
            </span>
          </span>
          <Switch
            checked={block.verifyEmail === true}
            onCheckedChange={() => update({ verifyEmail: !block.verifyEmail })}
          />
        </div>
      </>
    );
  }

  // ── Phone ──
  if (type === "phone") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithTextInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <ToggleRow
          label="International format"
          checked={block.internationalFormat !== false}
          onCheckedChange={() => update({ internationalFormat: !(block.internationalFormat !== false) })}
        />
        <CountryCodeCombobox
          value={block.defaultCountryCode ?? ""}
          onChange={(v) => update({ defaultCountryCode: v })}
        />
      </>
    );
  }

  // ── File upload ──
  if (type === "file_upload") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleRow
          label="Multiple files"
          checked={block.multipleFiles === true}
          onCheckedChange={() => update({ multipleFiles: !block.multipleFiles })}
        />
        <ToggleRow
          label="Max file size"
          checked={block.maxFileSize !== undefined}
          onCheckedChange={() =>
            update({ maxFileSize: block.maxFileSize !== undefined ? undefined : 10 })
          }
        />
        <SelectRow
          label="Allowed files"
          value={block.allowedFiles ?? "All"}
          options={["All", "Images", "Documents", "Spreadsheets", "Audio", "Video"]}
          onChange={(v) => update({ allowedFiles: v })}
        />
      </>
    );
  }

  // ── Date ──
  if (type === "date") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithTextInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <SelectRow
          label="Format"
          value={block.dateFormat ?? "Full date"}
          options={["Full date", "Month / Year", "Year"]}
          onChange={(v) => update({ dateFormat: v })}
        />
        <SelectRow
          label="Disable days"
          value={block.disableDays ?? "None"}
          options={["None", "Weekends", "Weekdays"]}
          onChange={(v) => update({ disableDays: v })}
        />
        <SelectRow
          label="Before date"
          value={block.beforeDate ?? "Off"}
          options={["Off", "Today", "Custom"]}
          onChange={(v) => update({ beforeDate: v })}
        />
        <SelectRow
          label="After date"
          value={block.afterDate ?? "Off"}
          options={["Off", "Today", "Custom"]}
          onChange={(v) => update({ afterDate: v })}
        />
        <SelectRow
          label="Date range"
          value={block.dateRange ?? "Off"}
          options={["Off", "On"]}
          onChange={(v) => update({ dateRange: v })}
        />
        <SelectRow
          label="Specific dates"
          value={block.specificDates ?? "Off"}
          options={["Off", "On"]}
          onChange={(v) => update({ specificDates: v })}
        />
        <SelectRow
          label="Start week on"
          value={block.startWeekOn ?? "Monday"}
          options={["Monday", "Sunday", "Saturday"]}
          onChange={(v) => update({ startWeekOn: v })}
        />
      </>
    );
  }

  // ── Linear scale ──
  if (type === "linear_scale") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithTextInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <InputRow
          label="Scale start"
          value={block.scaleStart ?? 0}
          onChange={(v) => update({ scaleStart: v })}
        />
        <InputRow
          label="Scale end"
          value={block.scaleEnd ?? 10}
          onChange={(v) => update({ scaleEnd: v })}
        />
        <InputRow
          label="Scale step"
          value={block.scaleStep ?? 1}
          onChange={(v) => update({ scaleStep: v })}
        />
        <ToggleRow
          label="Left label"
          checked={block.leftLabel !== undefined}
          onCheckedChange={() =>
            update({ leftLabel: block.leftLabel !== undefined ? undefined : "" })
          }
        />
        <ToggleRow
          label="Center label"
          checked={block.centerLabel !== undefined}
          onCheckedChange={() =>
            update({ centerLabel: block.centerLabel !== undefined ? undefined : "" })
          }
        />
        <ToggleRow
          label="Right label"
          checked={block.rightLabel !== undefined}
          onCheckedChange={() =>
            update({ rightLabel: block.rightLabel !== undefined ? undefined : "" })
          }
        />
      </>
    );
  }

  // ── Matrix ──
  if (type === "matrix") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleRow
          label="Multiple selection"
          checked={block.multipleSelection === true}
          onCheckedChange={() => update({ multipleSelection: !block.multipleSelection })}
        />
        <ToggleRow
          label="Randomize rows"
          checked={block.randomizeRows === true}
          onCheckedChange={() => update({ randomizeRows: !block.randomizeRows })}
        />
      </>
    );
  }

  // ── Rating ──
  if (type === "rating") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithTextInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
        <InputRow
          label="Stars"
          value={block.ratingStars ?? 5}
          onChange={(v) => update({ ratingStars: v })}
        />
      </>
    );
  }

  // ── Payment ──
  if (type === "payment") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
      </>
    );
  }

  // ── Signature ──
  if (type === "signature") {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <TextInputRow
          label="Signature label"
          value={block.signatureLabel ?? ""}
          onChange={(v) => update({ signatureLabel: v })}
        />
      </>
    );
  }

  // ── Ranking ──
  if (type === "ranking") {
    return (
      <ToggleRow
        label="Required"
        checked={block.required !== false}
        onCheckedChange={() => update({ required: !(block.required !== false) })}
      />
    );
  }

  // ── Simple types (link, phone, time, etc.) ──
  if (SIMPLE_TYPES.has(type)) {
    return (
      <>
        <ToggleRow
          label="Required"
          checked={block.required !== false}
          onCheckedChange={() => update({ required: !(block.required !== false) })}
        />
        <ToggleWithTextInput
          label="Default answer"
          enabled={block.defaultAnswer !== undefined}
          value={block.defaultAnswer ?? ""}
          onToggle={() =>
            update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
          }
          onChange={(v) => update({ defaultAnswer: v })}
        />
      </>
    );
  }

  // Fallback — just Required + Default answer
  return (
    <>
      <ToggleRow
        label="Required"
        checked={block.required !== false}
        onCheckedChange={() => update({ required: !(block.required !== false) })}
      />
      <ToggleWithTextInput
        label="Default answer"
        enabled={block.defaultAnswer !== undefined}
        value={block.defaultAnswer ?? ""}
        onToggle={() =>
          update({ defaultAnswer: block.defaultAnswer !== undefined ? undefined : "" })
        }
        onChange={(v) => update({ defaultAnswer: v })}
      />
    </>
  );
}

// ── Shared UI components ────────────────────────────────────────

function ToggleRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ToggleWithTextInput({
  label,
  enabled,
  value,
  onToggle,
  onChange,
}: {
  label: string;
  enabled: boolean;
  value: string;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between py-1.5">
        <span className="text-sm">{label}</span>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mb-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );
}

function ToggleWithSelectInput({
  label,
  enabled,
  value,
  options,
  onToggle,
  onChange,
}: {
  label: string;
  enabled: boolean;
  value: string;
  options: string[];
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between py-1.5">
        <span className="text-sm">{label}</span>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger size="sm" className="mb-1 w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

function ToggleWithInput({
  label,
  enabled,
  value,
  onToggle,
  onChange,
}: {
  label: string;
  enabled: boolean;
  value: number;
  onToggle: () => void;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between py-1.5">
        <span className="text-sm">{label}</span>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mb-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="h-7 w-auto gap-1 border-0 bg-transparent px-2 text-xs text-muted-foreground shadow-none focus-visible:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="py-1">
      <span className="text-sm">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function TextInputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="py-1">
      <span className="text-sm">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function ActionItem({
  icon: Icon,
  label,
  variant,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: "destructive";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-accent ${
        variant === "destructive"
          ? "text-destructive hover:text-destructive"
          : ""
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function CountryCodeCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = COUNTRY_CODES.find((c) => c.code === value);

  return (
    <div className="py-1">
      <span className="text-sm">Default country code</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={open}
            className="mt-1 flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm hover:bg-accent/50"
          >
            <span className={selected ? "" : "text-muted-foreground"}>
              {selected ? `${selected.name} (${selected.dial})` : "Off"}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="off"
                  onSelect={() => {
                    onChange("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3.5 w-3.5",
                      !value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Off
                </CommandItem>
                {COUNTRY_CODES.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.dial}`}
                    onSelect={() => {
                      onChange(country.code);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3.5 w-3.5",
                        value === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-xs text-muted-foreground">{country.dial}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
