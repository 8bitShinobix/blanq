"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { format } from "date-fns";
import SignaturePad from "signature_pad";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import type { Value as PhoneValue } from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FieldError } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Star,
  Upload,
  ChevronsUpDown,
  ImageIcon,
  Film,
  Volume2,
  Globe,
  Wallet,
  ShieldCheck,
  CalendarIcon,
  ChevronDownIcon,
  GripVertical,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveContent } from "@/lib/resolve-mentions";
import type { Block } from "@/components/editor/types";

interface PreviewBlockProps {
  block: Block;
  value: unknown;
  formData?: Record<string, unknown>;
  onChange: (value: unknown) => void;
  error?: string;
  inputStyle?: React.CSSProperties;
  placeholderColor?: string;
  accentColor?: string;
}

function FieldLabel({ block, formData }: { block: Block; formData?: Record<string, unknown> }) {
  if (!block.content) return null;
  const resolved = resolveContent(block.content, block.mentions, formData || {});
  return (
    <div className="mb-3 flex items-baseline gap-1.5">
      <Label className="text-lg font-semibold">{resolved}</Label>
      <span className="text-base text-red-500">*</span>
    </div>
  );
}

function LetterBadge({ index, selected }: { index: number; selected?: boolean }) {
  const letter = String.fromCharCode(65 + index);
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors ${
        selected
          ? "bg-foreground border border-foreground text-background"
          : "bg-muted border border-border border-b-2 text-muted-foreground"
      }`}
    >
      {letter}
    </span>
  );
}

export function PreviewBlock({ block, value, formData, onChange, error, inputStyle, placeholderColor, accentColor }: PreviewBlockProps) {
  switch (block.type) {
    // ── Text inputs ──────────────────────────────────────────────
    case "short_answer":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <Input
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={block.placeholder || ""}
            aria-invalid={!!error}
            style={inputStyle}
          />
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "long_answer":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <Textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={block.placeholder || ""}
            rows={4}
            className="resize-none"
            aria-invalid={!!error}
            style={{ ...inputStyle, height: "auto" }}
          />
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "number":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <Input
            type="number"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={block.placeholder || ""}
            aria-invalid={!!error}
            style={inputStyle}
          />
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "email":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <Input
            type="email"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={block.placeholder || ""}
            aria-invalid={!!error}
            style={inputStyle}
          />
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "phone":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <PhoneInput
            value={(value as PhoneValue) || ""}
            onChange={(v) => onChange(v)}
            defaultCountry="IN"
            placeholder={block.placeholder || "Enter phone number"}
          />
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "link":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <Input
            type="url"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={block.placeholder || ""}
            aria-invalid={!!error}
            style={inputStyle}
          />
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "date":
      return <DateField block={block} value={value} formData={formData} onChange={onChange} error={error} />;

    case "time":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <Input
            type="time"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            style={inputStyle}
          />
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    // ── Selection types ──────────────────────────────────────────
    case "multiple_choice":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <div className="flex flex-col gap-2">
            {(block.options || ["Option 1"]).map((option, i) => {
              const selected = value === option;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(option)}
                  className={`flex w-fit items-center gap-2.5 rounded-lg border px-3.5 py-2 text-base transition-colors ${
                    selected
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <LetterBadge index={i} selected={selected} />
                  {option}
                </button>
              );
            })}
          </div>
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "checkboxes":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <div className="space-y-3">
            {(block.options || ["Option 1"]).map((option, i) => {
              const checked = Array.isArray(value)
                ? (value as string[]).includes(option)
                : false;
              return (
                <div key={i} className="flex items-center gap-3">
                  <Checkbox
                    id={`${block.id}-${i}`}
                    checked={checked}
                    className="h-5 w-5"
                    onCheckedChange={(c) => {
                      const current = Array.isArray(value)
                        ? (value as string[])
                        : [];
                      onChange(
                        c
                          ? [...current, option]
                          : current.filter((v) => v !== option)
                      );
                    }}
                  />
                  <Label htmlFor={`${block.id}-${i}`} className="text-base font-normal">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "dropdown":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <Select
            value={(value as string) || ""}
            onValueChange={(v) => onChange(v)}
          >
            <SelectTrigger aria-invalid={!!error} className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {(block.options || ["Option 1"]).map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "multi_select":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <div className="flex flex-wrap gap-2">
            {(block.options || ["Option 1"]).map((option, i) => {
              const selected = Array.isArray(value)
                ? (value as string[]).includes(option)
                : false;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(value)
                      ? (value as string[])
                      : [];
                    onChange(
                      selected
                        ? current.filter((v) => v !== option)
                        : [...current, option]
                    );
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    // ── Special inputs ───────────────────────────────────────────
    case "file_upload":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-10">
            <Upload className="h-6 w-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Click to choose a file or drag here
            </p>
            <p className="text-xs text-muted-foreground/60">
              Size limit: 10 MB
            </p>
          </div>
        </div>
      );

    case "linear_scale":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors ${
                  value === i
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-muted"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          {error && <FieldError>{error}</FieldError>}
        </div>
      );

    case "rating":
      return <RatingField block={block} value={value} formData={formData} onChange={onChange} error={error} />;

    case "matrix":
      return <MatrixField block={block} value={value} formData={formData} onChange={onChange} error={error} />;

    case "signature":
      return <SignatureField block={block} value={value} formData={formData} onChange={onChange} error={error} />;

    case "ranking":
      return <RankingField block={block} value={value} formData={formData} onChange={onChange} error={error} />;

    case "payment":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">
              Payment powered by Stripe
            </p>
          </div>
        </div>
      );

    case "wallet_connect":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:bg-muted"
          >
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </button>
        </div>
      );

    // ── Layout blocks ────────────────────────────────────────────
    case "heading_1":
      return block.content ? (
        <h1 className="text-3xl font-bold">{resolveContent(block.content, block.mentions, formData || {})}</h1>
      ) : null;

    case "heading_2":
      return block.content ? (
        <h2 className="text-2xl font-semibold">{resolveContent(block.content, block.mentions, formData || {})}</h2>
      ) : null;

    case "heading_3":
      return block.content ? (
        <h3 className="text-xl font-semibold">{resolveContent(block.content, block.mentions, formData || {})}</h3>
      ) : null;

    case "title":
      return block.content ? (
        <h1 className="text-4xl font-bold">{resolveContent(block.content, block.mentions, formData || {})}</h1>
      ) : null;

    case "label":
      return block.content ? (
        <p className="text-sm font-medium text-muted-foreground">
          {resolveContent(block.content, block.mentions, formData || {})}
        </p>
      ) : null;

    case "text":
      return block.content ? (
        <p className="text-base text-foreground">{resolveContent(block.content, block.mentions, formData || {})}</p>
      ) : null;

    case "divider":
      return <hr className="border-border" />;

    // ── Embed blocks ─────────────────────────────────────────────
    case "image":
      return (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-6 py-10">
          <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
        </div>
      );

    case "video":
      return (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-6 py-10">
          <Film className="h-8 w-8 text-muted-foreground/30" />
        </div>
      );

    case "audio":
      return (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-6 py-10">
          <Volume2 className="h-8 w-8 text-muted-foreground/30" />
        </div>
      );

    case "embed":
      return (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-6 py-10">
          <Globe className="h-8 w-8 text-muted-foreground/30" />
        </div>
      );

    // ── Advanced blocks ────────────────────────────────────────────
    case "recaptcha":
      return null;

    case "respondents_country":
      return (
        <div>
          <FieldLabel block={block} formData={formData} />
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/10 px-3 py-2.5 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Auto-detected country</span>
          </div>
        </div>
      );

    // Skip non-visual blocks
    case "new_page":
    case "thank_you_page":
    case "conditional_logic":
      return null;

    default:
      return null;
  }
}

// ── Date field with Calendar popover (shadcn pattern) ───────────
function DateField({ block, value, formData, onChange, error }: PreviewBlockProps) {
  const [open, setOpen] = useState(false);
  const dateValue = value as string | undefined;

  const selectedDate = dateValue ? new Date(dateValue + "T00:00:00") : undefined;

  return (
    <div>
      <FieldLabel block={block} formData={formData} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-invalid={!!error}
            className={cn(
              "w-full justify-between font-normal",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              !dateValue && "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {dateValue ? format(selectedDate!, "PPP") : "Select date"}
            </span>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            defaultMonth={selectedDate}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, "yyyy-MM-dd"));
              }
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

// ── Rating field (needs local hover state) ─────────────────────
function RatingField({ block, value, formData, onChange, error }: PreviewBlockProps) {
  const [hovered, setHovered] = useState(0);
  const rating = (value as number) || 0;

  return (
    <div>
      <FieldLabel block={block} formData={formData} />
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= (hovered || rating);
          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHovered(starValue)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(starValue)}
              className="transition-colors"
            >
              <Star
                className={`h-8 w-8 ${
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

// ── Matrix field ───────────────────────────────────────────────
function MatrixField({ block, value, formData, onChange, error }: PreviewBlockProps) {
  const rows = ["Row 1", "Row 2", "Row 3"];
  const cols = ["Column 1", "Column 2", "Column 3"];
  const selections = (value as Record<string, string>) || {};

  return (
    <div>
      <FieldLabel block={block} formData={formData} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-muted/30" />
            {cols.map((col) => (
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
          {rows.map((row) => (
            <TableRow key={row}>
              <TableCell className="text-muted-foreground">{row}</TableCell>
              {cols.map((col) => (
                <TableCell key={col} className="text-center">
                  <input
                    type="radio"
                    name={`${block.id}-${row}`}
                    checked={selections[row] === col}
                    onChange={() =>
                      onChange({ ...selections, [row]: col })
                    }
                    className="h-4 w-4 accent-foreground"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

// ── Signature field (canvas-based) ─────────────────────────────
function SignatureField({ block, value, formData, onChange, error }: PreviewBlockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(0, 0, 0)",
    });
    padRef.current = pad;

    // Resize canvas to match container
    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * ratio;
      canvas.height = container.clientHeight * ratio;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    pad.addEventListener("endStroke", () => {
      onChange(pad.toDataURL());
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      pad.off();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = useCallback(() => {
    padRef.current?.clear();
    onChange(undefined);
  }, [onChange]);

  return (
    <div>
      <FieldLabel block={block} formData={formData} />
      <div
        ref={containerRef}
        className="relative h-48 rounded-lg border border-dashed border-border overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair" />
        {!!value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 z-10 rounded-md bg-muted/80 p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center">
          <div className="mb-2 h-px w-full max-w-xs bg-border" />
          <span className="text-sm text-muted-foreground/60">Sign above</span>
        </div>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

// ── Ranking field (drag-to-reorder) ────────────────────────────
function RankingField({ block, value, formData, onChange }: PreviewBlockProps) {
  const options = block.options || ["Option 1"];
  const items = (Array.isArray(value) ? value : options) as string[];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onChange(newItems);
      }
    },
    [items, onChange]
  );

  // Initialize value with default order on first render
  useEffect(() => {
    if (!Array.isArray(value)) {
      onChange(options);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <FieldLabel block={block} formData={formData} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item, i) => (
              <SortableRankItem key={item} id={item} rank={i + 1} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableRankItem({ id, rank }: { id: string; rank: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5",
        isDragging && "z-10 shadow-lg"
      )}
    >
      <button
        type="button"
        className="shrink-0 cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
        {rank}
      </span>
      <span className="text-sm">{id}</span>
    </div>
  );
}
