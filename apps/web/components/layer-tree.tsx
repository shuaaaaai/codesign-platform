"use client";

import { useMemo, useState } from "react";
import type { LayerNode } from "@/types/design";

interface LayerTreeProps {
  layers: LayerNode[];
  selectedLayerId?: string | null;
  onSelectLayer: (layer: LayerNode) => void;
}

const typeIcons: Record<LayerNode["type"], string> = {
  group: "📁",
  text: "T",
  shape: "◻",
  image: "🖼",
};

function buildTree(nodes: LayerNode[]): Array<LayerNode & { children: LayerNode[] }> {
  const map = new Map<string, LayerNode & { children: LayerNode[] }>();
  nodes.forEach((node) => map.set(node.id, { ...node, children: [] }));

  const roots: Array<LayerNode & { children: LayerNode[] }> = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function TreeNode({
  node,
  depth,
  expanded,
  toggle,
  selectedLayerId,
  onSelectLayer,
}: {
  node: LayerNode & { children: LayerNode[] };
  depth: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  selectedLayerId?: string | null;
  onSelectLayer: (layer: LayerNode) => void;
}) {
  const isGroup = node.type === "group";
  const isExpanded = expanded.has(node.id);

  return (
    <div className="space-y-1">
      <button
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${selectedLayerId === node.id ? "bg-sky-100 text-sky-700" : "hover:bg-slate-100 text-slate-700"}`}
        style={{ paddingLeft: depth * 14 + 8 }}
        onClick={() => {
          if (isGroup) {
            toggle(node.id);
          }
          onSelectLayer(node);
        }}
        type="button"
      >
        <span className="w-4 text-center text-slate-400">{isGroup ? (isExpanded ? "▾" : "▸") : ""}</span>
        <span>{typeIcons[node.type]}</span>
        <span className="truncate">{node.name}</span>
      </button>
      {isExpanded && node.children.map((child) => <TreeNode key={child.id} node={child} depth={depth + 1} expanded={expanded} toggle={toggle} selectedLayerId={selectedLayerId} onSelectLayer={onSelectLayer} />)}
    </div>
  );
}

export function LayerTree({ layers, selectedLayerId, onSelectLayer }: LayerTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [keyword, setKeyword] = useState("");

  const tree = useMemo(() => buildTree(layers), [layers]);
  const filteredTree = useMemo(() => {
    if (!keyword.trim()) {
      return tree;
    }

    const walk = (node: LayerNode & { children: LayerNode[] }): (LayerNode & { children: LayerNode[] }) | null => {
      const nextChildren = node.children.map(walk).filter((value): value is LayerNode & { children: LayerNode[] } => Boolean(value));
      const matched = node.name.toLowerCase().includes(keyword.toLowerCase());
      return matched || nextChildren.length > 0 ? { ...node, children: nextChildren } : null;
    };

    return tree.map(walk).filter((value): value is LayerNode & { children: LayerNode[] } => Boolean(value));
  }, [keyword, tree]);

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">Layer Tree</h3>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索图层..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div className="space-y-1">
        {filteredTree.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} expanded={expandedIds} toggle={toggle} selectedLayerId={selectedLayerId} onSelectLayer={onSelectLayer} />
        ))}
      </div>
    </div>
  );
}
