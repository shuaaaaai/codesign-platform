import { create } from "zustand";
import type { LayerNode } from "@/types/design";

interface InspectState {
  selectedLayerId: string | null;
  selectedLayer: LayerNode | null;
  layerTree: LayerNode[];
  expandedLayerIds: string[];
  setSelectedLayerId: (id: string | null) => void;
  setSelectedLayer: (layer: LayerNode | null) => void;
  setLayerTree: (layers: LayerNode[]) => void;
  toggleExpanded: (id: string) => void;
}

export const useInspectStore = create<InspectState>((set) => ({
  selectedLayerId: null,
  selectedLayer: null,
  layerTree: [],
  expandedLayerIds: [],
  setSelectedLayerId: (selectedLayerId) => set({ selectedLayerId }),
  setSelectedLayer: (selectedLayer) => set({ selectedLayer }),
  setLayerTree: (layerTree) => set({ layerTree }),
  toggleExpanded: (id) =>
    set((state) => ({
      expandedLayerIds: state.expandedLayerIds.includes(id)
        ? state.expandedLayerIds.filter((expandedId) => expandedId !== id)
        : [...state.expandedLayerIds, id],
    })),
}));
