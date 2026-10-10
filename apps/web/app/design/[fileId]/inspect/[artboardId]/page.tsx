"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { CodeExportPanel } from "@/components/code-export-panel";
import { CommentSystem } from "@/components/comment-system";
import { LayerTree } from "@/components/layer-tree";
import { PropertyPanel } from "@/components/property-panel";
import { apiFetch, API_BASE_URL } from "@/lib/api";
import { useInspectStore } from "@/store/inspect";
import type { Artboard, LayerNode } from "@/types/design";

export default function InspectPage() {
  const params = useParams<{ fileId: string; artboardId: string }>();
  const selectedLayerId = useInspectStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useInspectStore((state) => state.setSelectedLayerId);
  const selectedLayer = useInspectStore((state) => state.selectedLayer);
  const setSelectedLayer = useInspectStore((state) => state.setSelectedLayer);

  const artboardId = params.artboardId;

  const { data: layersData, isLoading: layersLoading } = useQuery({
    queryKey: ["layers", artboardId],
    queryFn: () => apiFetch<{ layers: LayerNode[] }>(`/artboards/${artboardId}/layers`),
  });

  const { data: artboardData } = useQuery({
    queryKey: ["artboard", artboardId],
    queryFn: () => apiFetch<Artboard>(`/artboards/${artboardId}`),
  });

  const { data: layerData } = useQuery({
    queryKey: ["layer", selectedLayerId],
    queryFn: () => apiFetch<LayerNode>(`/layers/${selectedLayerId}`),
    enabled: Boolean(selectedLayerId),
  });

  useEffect(() => {
    if (layerData) {
      setSelectedLayer(layerData);
    }
  }, [layerData, setSelectedLayer]);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Inspect / {artboardId}</p>
            <h1 className="text-3xl font-bold text-slate-900">画板检查</h1>
          </div>
          <Link href={`/design/${params.fileId}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
            返回画布
          </Link>
        </header>

        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
          <LayerTree
            layers={layersData?.layers ?? []}
            selectedLayerId={selectedLayerId}
            onSelectLayer={(layer) => {
              setSelectedLayerId(layer.id);
              setSelectedLayer(layer);
            }}
          />

          <div className="relative h-[760px] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            {layersLoading && <div className="h-full animate-pulse rounded-2xl bg-slate-100" />}
            {!layersLoading && (
              <>
                {artboardData?.previewUrl ? (
                  <Image src={artboardData.previewUrl} alt={artboardData.name} fill className="rounded-2xl object-contain" />
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl bg-slate-100 text-slate-500">暂无预览图</div>
                )}

                {(layersData?.layers ?? []).map((layer) => (
                  <button
                    key={layer.id}
                    className={`absolute border-2 ${selectedLayerId === layer.id ? "border-sky-500" : "border-transparent hover:border-sky-300"}`}
                    style={{ left: layer.x, top: layer.y, width: layer.width, height: layer.height }}
                    onClick={() => setSelectedLayerId(layer.id)}
                    type="button"
                  />
                ))}

                <CommentSystem artboardId={artboardId} apiBaseUrl={API_BASE_URL} />
              </>
            )}
          </div>

          <div className="space-y-6">
            <PropertyPanel
              layer={selectedLayer}
              onCopyCSS={async (layerId) => {
                const response = await apiFetch<{ code: string }>(`/layers/${layerId}/code?format=css`);
                return response.code;
              }}
            />
            <CodeExportPanel layer={selectedLayer} apiBaseUrl={API_BASE_URL} />
          </div>
        </div>
      </div>
    </main>
  );
}
