"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import FlowNode from "./flow-node";
import type { Block } from "./types";

const nodeTypes = { flowNode: FlowNode };

const NODE_GAP_Y = 160;
const NODE_X = 300;

const defaultEdgeOptions = {
  type: "bezier",
  animated: true,
  style: { stroke: "#d1cfc9", strokeWidth: 1.5 },
};

/** Filter out empty text blocks — they add noise to the flow view. */
function visibleBlocks(blocks: Block[]): Block[] {
  return blocks.filter((b) => !(b.type === "text" && !b.content));
}

/** Build a map of block ID → block content (label) for resolving field references. */
function buildFieldLabels(blocks: Block[]): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const b of blocks) {
    if (b.content) labels[b.id] = b.content;
  }
  return labels;
}

function blocksToNodes(blocks: Block[]): Node[] {
  const filtered = visibleBlocks(blocks);
  const fieldLabels = buildFieldLabels(blocks);
  return filtered.map((block, i) => ({
    id: block.id,
    type: "flowNode",
    position: { x: NODE_X, y: i * NODE_GAP_Y },
    data: {
      blockType: block.type,
      content: block.content,
      required: block.required,
      ...(block.type === "conditional_logic" && {
        conditions: block.conditions,
        actions: block.actions,
        fieldLabels,
      }),
    },
  }));
}

function blocksToEdges(blocks: Block[]): Edge[] {
  const filtered = visibleBlocks(blocks);
  const blockIdSet = new Set(filtered.map((b) => b.id));
  const edges: Edge[] = [];

  for (let i = 0; i < filtered.length - 1; i++) {
    const isConditional = filtered[i].type === "conditional_logic";
    edges.push({
      id: `e-${filtered[i].id}-${filtered[i + 1].id}`,
      source: filtered[i].id,
      target: filtered[i + 1].id,
      ...(isConditional && {
        style: { stroke: "#6366f1", strokeWidth: 1.5 },
      }),
    });

    // Add branching edges from conditional blocks to their target blocks
    if (isConditional) {
      const block = filtered[i];
      for (const action of block.actions ?? []) {
        for (const targetId of action.targetBlocks) {
          // Only add edge if target block exists in the flow
          if (blockIdSet.has(targetId) && targetId !== filtered[i + 1]?.id) {
            edges.push({
              id: `e-cond-${block.id}-${targetId}`,
              source: block.id,
              target: targetId,
              style: { stroke: "#6366f1", strokeWidth: 1.5, strokeDasharray: "5 3" },
              animated: true,
              label: action.type === "show_blocks" ? "show" : action.type === "hide_blocks" ? "hide" : "",
              labelStyle: { fontSize: 10, fill: "#6366f1", fontWeight: 500 },
              labelBgStyle: { fill: "#faf9f6", fillOpacity: 0.9 },
              labelBgPadding: [4, 2] as [number, number],
              labelBgBorderRadius: 4,
            });
          }
        }
      }
    }
  }
  return edges;
}

function FlowCanvasContent({
  blocks,
  onClose,
}: {
  blocks: Block[];
  onClose: () => void;
}) {
  const initialNodes = useMemo(() => blocksToNodes(blocks), [blocks]);
  const initialEdges = useMemo(() => blocksToEdges(blocks), [blocks]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        nodesDraggable
        nodesConnectable={false}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={0.8}
          color="#d1cfc9"
        />
        <Controls
          showInteractive={false}
          className="!border-border/60 !bg-background/80 !shadow-none !backdrop-blur-sm [&>button]:!border-border/40 [&>button]:!bg-transparent [&>button]:!text-muted-foreground hover:[&>button]:!bg-accent/50"
        />
        <MiniMap
          nodeStrokeWidth={1}
          nodeColor="#e8e6e1"
          maskColor="rgba(250, 249, 246, 0.7)"
          pannable
          zoomable
          className="!rounded-lg !border-border/40 !bg-background/60 !shadow-none !backdrop-blur-sm"
        />
      </ReactFlow>
    </div>
  );
}

export function FlowCanvas({
  blocks,
  onClose,
}: {
  blocks: Block[];
  onClose: () => void;
}) {
  return (
    <ReactFlowProvider>
      <FlowCanvasContent blocks={blocks} onClose={onClose} />
    </ReactFlowProvider>
  );
}
