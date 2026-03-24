"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import {
  BLOCK_TYPES,
  CONDITIONAL_OPERATORS,
  type BlockType,
  type BlockCategory,
  type ConditionalRule,
  type ConditionalAction,
} from "./types";
import { BLOCK_ICON_MAP } from "./icon-map";

type FlowNodeData = {
  blockType: BlockType;
  content: string;
  required?: boolean;
  conditions?: ConditionalRule[];
  actions?: ConditionalAction[];
  fieldLabels?: Record<string, string>;
};

export type FlowNodeType = Node<FlowNodeData, "flowNode">;

const CATEGORY_COLORS: Record<BlockCategory, string> = {
  "Input blocks": "#6366f1",
  "Layout blocks": "#94a3b8",
  "Embed blocks": "#f59e0b",
  "Advanced blocks": "#10b981",
};

function getBlockMeta(type: BlockType) {
  const entry = BLOCK_TYPES.find((b) => b.type === type);
  return {
    label: entry?.label ?? type,
    icon: entry ? BLOCK_ICON_MAP[entry.icon] : undefined,
    category: (entry?.category ?? "Input blocks") as BlockCategory,
  };
}

function formatOperator(op: string): string {
  return CONDITIONAL_OPERATORS.find((o) => o.value === op)?.label.toLowerCase() ?? op;
}

function formatActionType(type: string): string {
  switch (type) {
    case "show_blocks": return "Show";
    case "hide_blocks": return "Hide";
    case "jump_to_page": return "Jump to";
    case "require_answer": return "Require";
    default: return type;
  }
}

function ConditionalContent({
  conditions,
  actions,
  fieldLabels,
}: {
  conditions?: ConditionalRule[];
  actions?: ConditionalAction[];
  fieldLabels?: Record<string, string>;
}) {
  if (!conditions?.length && !actions?.length) {
    return <span className="font-normal text-muted-foreground/50">No conditions</span>;
  }

  return (
    <div className="space-y-1.5">
      {/* Conditions */}
      {conditions?.map((c, i) => {
        const fieldName = fieldLabels?.[c.field] || "field";
        const opLabel = formatOperator(c.operator);
        const needsValue = !c.operator.startsWith("is_empty") && !c.operator.startsWith("is_not_empty");
        return (
          <div key={i} className="flex items-center gap-1 text-[11px] leading-tight">
            {i > 0 && (
              <span className="font-medium uppercase text-muted-foreground/50 text-[9px]">
                {c.connector ?? "and"}
              </span>
            )}
            <span className="text-foreground/80 truncate">
              {fieldName} <span className="text-indigo-500">{opLabel}</span>
              {needsValue && c.value ? ` "${c.value}"` : ""}
            </span>
          </div>
        );
      })}

      {/* Actions */}
      {actions?.map((a, i) => (
        <div key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
          <span className="text-emerald-600">{formatActionType(a.type)}</span>
          <span>{a.targetBlocks.length} block{a.targetBlocks.length !== 1 ? "s" : ""}</span>
        </div>
      ))}
    </div>
  );
}

function FlowNodeComponent({ data, isConnectable }: NodeProps<FlowNodeType>) {
  const { label, icon: Icon, category } = getBlockMeta(data.blockType);
  const accentColor = CATEGORY_COLORS[category];
  const isConditional = data.blockType === "conditional_logic";

  return (
    <div className="group/node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent !opacity-0 group-hover/node:!h-2 group-hover/node:!w-2 group-hover/node:!opacity-100 !transition-all !duration-200"
        style={{ background: accentColor }}
      />

      <div
        className={`relative flex ${isConditional ? "w-60" : "w-52"} overflow-hidden rounded-lg border border-border/60 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 ease-out hover:border-border hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]`}
      >
        {/* Left accent bar */}
        <div
          className="w-[3px] shrink-0"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex-1 px-3 py-2.5">
          {/* Header: icon + label */}
          <div className="flex items-center gap-1.5">
            {Icon && (
              <span className="shrink-0" style={{ color: accentColor }}>
                <Icon className="h-3 w-3" strokeWidth={1.5} />
              </span>
            )}
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {label}
            </span>
            {data.required && (
              <span className="ml-auto text-[9px] font-medium uppercase tracking-wide text-orange-500/80">
                Required
              </span>
            )}
          </div>

          {/* Content */}
          <div className="mt-1.5">
            {isConditional ? (
              <ConditionalContent
                conditions={data.conditions}
                actions={data.actions}
                fieldLabels={data.fieldLabels}
              />
            ) : (
              <p className="text-[13px] font-medium leading-snug text-foreground/90 truncate">
                {data.content || (
                  <span className="font-normal text-muted-foreground/50">Untitled</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent !opacity-0 group-hover/node:!h-2 group-hover/node:!w-2 group-hover/node:!opacity-100 !transition-all !duration-200"
        style={{ background: accentColor }}
      />
    </div>
  );
}

export default memo(FlowNodeComponent);
