"use client";

import { useCallback, useMemo, useState } from "react";
import {
  GitBranch,
  Zap,
  MoreVertical,
  ShieldCheck,
  HelpCircle,
  Check,
  Plus,
  Trash2,
  Copy,
  Group,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CONDITIONAL_OPERATORS,
  CONDITIONAL_ACTIONS,
  BLOCK_TYPE_TO_FIELD_CATEGORY,
  getOperatorsForBlockType,
  type Block,
  type BlockType,
  type FieldCategory,
  type ConditionalOperator,
  type ConditionalActionType,
  type ConditionalConnector,
  type ConditionalRule,
  type ConditionalAction,
} from "./types";

const INPUT_BLOCK_TYPES = new Set<string>([
  "short_answer",
  "long_answer",
  "multiple_choice",
  "checkboxes",
  "dropdown",
  "multi_select",
  "number",
  "email",
  "phone",
  "link",
  "file_upload",
  "date",
  "time",
  "linear_scale",
  "matrix",
  "rating",
  "payment",
  "signature",
  "ranking",
  "wallet_connect",
]);

const DEFAULT_CONDITION: ConditionalRule = {
  field: "",
  operator: "is",
  value: "",
};

const DEFAULT_ACTION: ConditionalAction = {
  type: "show_blocks" as ConditionalActionType,
  targetBlocks: [],
};

// ── Conditional Logic Card ──────────────────────────────────────

interface ConditionalLogicCardProps {
  block: Block;
  allBlocks: Block[];
  onUpdate: (id: string, updates: Partial<Block>) => void;
}

export function ConditionalLogicCard({
  block,
  allBlocks,
  onUpdate,
}: ConditionalLogicCardProps) {
  const inputBlocks = useMemo(
    () =>
      allBlocks.filter(
        (b) => INPUT_BLOCK_TYPES.has(b.type) && b.id !== block.id
      ),
    [allBlocks, block.id]
  );

  const conditions = block.conditions?.length
    ? block.conditions
    : [DEFAULT_CONDITION];
  const actions = block.actions?.length ? block.actions : [DEFAULT_ACTION];

  // ── Condition CRUD ──

  const setConditions = useCallback(
    (next: ConditionalRule[]) => {
      onUpdate(block.id, { conditions: next });
    },
    [block.id, onUpdate]
  );

  const updateCondition = useCallback(
    (index: number, updates: Partial<ConditionalRule>) => {
      const next = conditions.map((c, i) =>
        i === index ? { ...c, ...updates } : c
      );
      setConditions(next);
    },
    [conditions, setConditions]
  );

  const addCondition = useCallback(
    (afterIndex: number) => {
      const next = [...conditions];
      next.splice(afterIndex + 1, 0, {
        ...DEFAULT_CONDITION,
        connector: "and",
      });
      setConditions(next);
    },
    [conditions, setConditions]
  );

  const removeCondition = useCallback(
    (index: number) => {
      if (conditions.length <= 1) return;
      setConditions(conditions.filter((_, i) => i !== index));
    },
    [conditions, setConditions]
  );

  const duplicateCondition = useCallback(
    (index: number) => {
      const next = [...conditions];
      next.splice(index + 1, 0, { ...conditions[index], connector: "and" });
      setConditions(next);
    },
    [conditions, setConditions]
  );

  // ── Action CRUD ──

  const setActions = useCallback(
    (next: ConditionalAction[]) => {
      onUpdate(block.id, { actions: next });
    },
    [block.id, onUpdate]
  );

  const updateAction = useCallback(
    (index: number, updates: Partial<ConditionalAction>) => {
      const next = actions.map((a, i) =>
        i === index ? { ...a, ...updates } : a
      );
      setActions(next);
    },
    [actions, setActions]
  );

  const addAction = useCallback(
    (afterIndex: number) => {
      const next = [...actions];
      next.splice(afterIndex + 1, 0, { ...DEFAULT_ACTION });
      setActions(next);
    },
    [actions, setActions]
  );

  const removeAction = useCallback(
    (index: number) => {
      if (actions.length <= 1) return;
      setActions(actions.filter((_, i) => i !== index));
    },
    [actions, setActions]
  );

  const duplicateAction = useCallback(
    (index: number) => {
      const next = [...actions];
      next.splice(index + 1, 0, { ...actions[index] });
      setActions(next);
    },
    [actions, setActions]
  );

  return (
    <div className="rounded-xl border border-border/50 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* ── Conditions section ── */}
      <div className="p-5 pb-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10">
            <GitBranch className="h-3 w-3 text-blue-500/80" strokeWidth={1.5} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500/80">
            When
          </span>
        </div>

        <div className="space-y-1.5">
          {conditions.map((condition, i) => {
            const isFirst = i === 0;
            const selectedBlock = inputBlocks.find((b) => b.id === condition.field);
            const fieldCategory = selectedBlock
              ? BLOCK_TYPE_TO_FIELD_CATEGORY[selectedBlock.type]
              : undefined;
            const validOperators = getOperatorsForBlockType(selectedBlock?.type as BlockType | undefined);
            const filteredOps = CONDITIONAL_OPERATORS.filter((op) =>
              validOperators.includes(op.value)
            );
            const isUnary =
              condition.operator === "is_empty" ||
              condition.operator === "is_not_empty";

            return (
              <div key={i}>
                {/* Connector chip between rows */}
                {!isFirst && (
                  <div className="flex items-center gap-2 py-1 pl-1">
                    <Select
                      value={condition.connector || "and"}
                      onValueChange={(v) =>
                        updateCondition(i, {
                          connector: v as ConditionalConnector,
                        })
                      }
                    >
                      <SelectTrigger className="h-5 w-14 gap-0.5 rounded-full border-dashed border-border/50 text-[10px] font-medium text-muted-foreground/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="and">And</SelectItem>
                        <SelectItem value="or">Or</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="h-px flex-1 bg-border/30" />
                  </div>
                )}

                {/* Condition row */}
                <div className="group/row flex items-center gap-1.5 rounded-lg bg-muted/30 px-2.5 py-2 transition-colors hover:bg-muted/50">
                  <Select
                    value={condition.field}
                    onValueChange={(v) => {
                      const newBlock = inputBlocks.find((b) => b.id === v);
                      const newOps = getOperatorsForBlockType(newBlock?.type as BlockType | undefined);
                      const updates: Partial<ConditionalRule> = { field: v };
                      if (!newOps.includes(condition.operator)) {
                        updates.operator = newOps[0];
                        updates.value = "";
                      }
                      updateCondition(i, updates);
                    }}
                  >
                    <SelectTrigger className="h-7 w-[130px] border-0 bg-muted/40 text-xs shadow-none hover:bg-muted/70">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {inputBlocks.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.content || b.type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={condition.operator}
                    onValueChange={(v) =>
                      updateCondition(i, {
                        operator: v as ConditionalOperator,
                      })
                    }
                  >
                    <SelectTrigger className="h-7 w-auto min-w-[70px] border-0 bg-muted/40 text-xs shadow-none hover:bg-muted/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredOps.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {!isUnary && (
                    <ConditionValueInput
                      condition={condition}
                      fieldCategory={fieldCategory}
                      fieldOptions={selectedBlock?.options}
                      onChange={(value) => updateCondition(i, { value })}
                    />
                  )}

                  <RowMenu
                    onAdd={() => addCondition(i)}
                    onRemove={() => removeCondition(i)}
                    onDuplicate={() => duplicateCondition(i)}
                    canRemove={conditions.length > 1}
                    addLabel="Add condition"
                    showWrap
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-dashed border-border/40" />

      {/* ── Actions section ── */}
      <div className="p-5 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10">
            <Zap className="h-3 w-3 text-amber-500/80" strokeWidth={1.5} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500/80">
            Then
          </span>
        </div>

        <div className="space-y-1.5">
          {actions.map((action, i) => {
            const isFirst = i === 0;
            const needsTargetBlocks =
              action.type === "show_blocks" ||
              action.type === "hide_blocks" ||
              action.type === "require_answer";

            return (
              <div key={i}>
                {!isFirst && (
                  <div className="flex items-center gap-2 py-1 pl-1">
                    <span className="rounded-full border border-dashed border-border/50 px-2 py-0 text-[10px] font-medium text-muted-foreground/50">
                      And
                    </span>
                    <div className="h-px flex-1 bg-border/30" />
                  </div>
                )}

                <div className="group/row flex items-center gap-1.5 rounded-lg bg-muted/30 px-2.5 py-2 transition-colors hover:bg-muted/50">
                  <Select
                    value={action.type}
                    onValueChange={(v) =>
                      updateAction(i, { type: v as ConditionalActionType })
                    }
                  >
                    <SelectTrigger className="h-7 w-[170px] border-0 bg-muted/40 text-xs shadow-none hover:bg-muted/70">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONAL_ACTIONS.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {needsTargetBlocks && (
                    <TargetBlocksSelector
                      allBlocks={allBlocks}
                      currentBlockId={block.id}
                      selectedIds={action.targetBlocks}
                      onChange={(ids) =>
                        updateAction(i, { targetBlocks: ids })
                      }
                    />
                  )}

                  <RowMenu
                    onAdd={() => addAction(i)}
                    onRemove={() => removeAction(i)}
                    onDuplicate={() => duplicateAction(i)}
                    canRemove={actions.length > 1}
                    addLabel="Add action"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Condition Value Input (type-aware) ──────────────────────────

function ConditionValueInput({
  condition,
  fieldCategory,
  fieldOptions,
  onChange,
}: {
  condition: ConditionalRule;
  fieldCategory: FieldCategory | undefined;
  fieldOptions: string[] | undefined;
  onChange: (value: string) => void;
}) {
  const baseClass =
    "h-7 flex-1 min-w-[80px] border-0 bg-muted/40 text-xs shadow-none placeholder:text-muted-foreground/30 hover:bg-muted/70";

  // Choice fields → dropdown of field options
  if (
    (fieldCategory === "single_choice" || fieldCategory === "multi_choice") &&
    fieldOptions?.length
  ) {
    return (
      <Select value={condition.value} onValueChange={onChange}>
        <SelectTrigger className={`${baseClass} w-auto`}>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {fieldOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Number fields → number input
  if (fieldCategory === "number") {
    return (
      <Input
        type="number"
        value={condition.value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Value"
        className={baseClass}
      />
    );
  }

  // Date fields → date input
  if (fieldCategory === "date") {
    return (
      <Input
        type="date"
        value={condition.value}
        onChange={(e) => onChange(e.target.value)}
        className={baseClass}
      />
    );
  }

  // Time fields → time input
  if (fieldCategory === "time") {
    return (
      <Input
        type="time"
        value={condition.value}
        onChange={(e) => onChange(e.target.value)}
        className={baseClass}
      />
    );
  }

  // Default: text input
  return (
    <Input
      value={condition.value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Value"
      className={baseClass}
    />
  );
}

// ── Row Context Menu ────────────────────────────────────────────

function RowMenu({
  onAdd,
  onRemove,
  onDuplicate,
  canRemove,
  addLabel,
  showWrap,
}: {
  onAdd: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  canRemove: boolean;
  addLabel: string;
  showWrap?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-auto shrink-0 rounded-md p-1 text-muted-foreground/20 opacity-0 transition-all hover:bg-muted/50 hover:text-muted-foreground group-hover/row:opacity-100">
          <MoreVertical className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onAdd}>
          <Plus className="mr-2 h-3.5 w-3.5" />
          {addLabel}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-3.5 w-3.5" />
          Duplicate
        </DropdownMenuItem>
        {showWrap && (
          <DropdownMenuItem disabled>
            <Group className="mr-2 h-3.5 w-3.5" />
            Wrap in group
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onRemove}
          disabled={!canRemove}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Target Blocks Multi-Select ──────────────────────────────────

function TargetBlocksSelector({
  allBlocks,
  currentBlockId,
  selectedIds,
  onChange,
}: {
  allBlocks: Block[];
  currentBlockId: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const selectableBlocks = useMemo(
    () =>
      allBlocks.filter(
        (b) => b.id !== currentBlockId && b.type !== "conditional_logic"
      ),
    [allBlocks, currentBlockId]
  );

  const toggleBlock = useCallback(
    (id: string) => {
      onChange(
        selectedIds.includes(id)
          ? selectedIds.filter((s) => s !== id)
          : [...selectedIds, id]
      );
    },
    [selectedIds, onChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-7 min-w-[140px] flex-1 items-center gap-1 rounded-md bg-muted/40 px-2 text-xs transition-colors hover:bg-muted/70"
        >
          {selectedIds.length === 0 ? (
            <span className="text-muted-foreground/30">Select blocks...</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedIds.map((id) => {
                const b = allBlocks.find((bl) => bl.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex h-5 items-center rounded-md bg-muted/60 px-1.5 text-[10px] font-medium text-foreground/70"
                  >
                    {b?.content || b?.type.replace(/_/g, " ") || id}
                  </span>
                );
              })}
            </div>
          )}
          <ChevronDown className="ml-auto h-3 w-3 shrink-0 text-muted-foreground/25" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search blocks..." />
          <CommandList>
            <CommandEmpty>No blocks found.</CommandEmpty>
            <CommandGroup>
              {selectableBlocks.map((b) => {
                const isSelected = selectedIds.includes(b.id);
                return (
                  <CommandItem
                    key={b.id}
                    value={b.content || b.type.replace(/_/g, " ")}
                    onSelect={() => toggleBlock(b.id)}
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                        isSelected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/20"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span className="truncate text-xs">
                      {b.content || b.type.replace(/_/g, " ")}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ── reCAPTCHA Card ──────────────────────────────────────────────

export function RecaptchaCard() {
  return (
    <div className="rounded-xl border border-border/50 bg-background p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
          <ShieldCheck className="h-4.5 w-4.5 text-green-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">reCAPTCHA enabled</p>
          <p className="text-xs text-muted-foreground/60">
            Invisible bot protection &mdash; verified on submit
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Respondent's Country Card ───────────────────────────────────

export function RespondentsCountryCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <span className="text-sm text-foreground">India</span>
        <span className="ml-auto text-lg">🇮🇳</span>
      </div>
      <div className="flex items-center gap-1.5 pl-1 text-xs text-muted-foreground/40 transition-colors hover:text-muted-foreground">
        <HelpCircle className="h-3.5 w-3.5" />
        <span className="cursor-pointer hover:underline">
          Learn about respondent country
        </span>
      </div>
    </div>
  );
}
