type LayerNode = {
  id: string;
  name: string;
  children?: LayerNode[];
};

const tree: LayerNode[] = [
  { id: "1", name: "Frame 01", children: [
    { id: "1.1", name: "Header" },
    { id: "1.2", name: "CTA Button", children: [
      { id: "1.2.1", name: "Label" },
    ] },
  ] },
  { id: "2", name: "Hero Illustration" },
  { id: "3", name: "Footer" },
];

function LayerBranch({ node, depth = 0 }: { node: LayerNode; depth?: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center rounded-lg px-2 py-1.5 hover:bg-slate-100" style={{ paddingLeft: `${depth * 14 + 8}px` }}>
        <span className="mr-2 text-slate-400">▾</span>
        <span className="text-sm font-medium text-slate-700">{node.name}</span>
      </div>
      {node.children?.map((child) => <LayerBranch key={child.id} node={child} depth={depth + 1} />)}
    </div>
  );
}

export function LayerTree() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Layer Tree</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">8 layers</span>
      </div>
      <div className="space-y-1">
        {tree.map((node) => <LayerBranch key={node.id} node={node} />)}
      </div>
    </div>
  );
}
