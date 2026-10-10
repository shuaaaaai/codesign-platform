import { create } from "zustand";
import type { Artboard, Collaborator } from "@/types/design";

interface CanvasState {
  fileId: string | null;
  artboards: Artboard[];
  selectedArtboardId: string | null;
  zoom: number;
  panOffset: { x: number; y: number };
  collaborators: Collaborator[];
  setFileId: (fileId: string) => void;
  setArtboards: (artboards: Artboard[]) => void;
  selectArtboard: (artboardId: string | null) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setCollaborators: (collaborators: Collaborator[]) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  fileId: null,
  artboards: [],
  selectedArtboardId: null,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  collaborators: [],
  setFileId: (fileId) => set({ fileId }),
  setArtboards: (artboards) => set({ artboards }),
  selectArtboard: (selectedArtboardId) => set({ selectedArtboardId }),
  setZoom: (zoom) => set({ zoom }),
  setPanOffset: (panOffset) => set({ panOffset }),
  setCollaborators: (collaborators) => set({ collaborators }),
}));
