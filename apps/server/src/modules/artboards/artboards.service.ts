import { Injectable } from "@nestjs/common";

@Injectable()
export class ArtboardsService {
  get(id: string) {
    return { id, name: "Landing", width: 1440, height: 1024, worldX: 0, worldY: 0 };
  }

  layers(id: string) {
    return { artboardId: id, layers: [{ id: "layer_1", name: "Hero Button", type: "shape", x: 320, y: 200, width: 180, height: 56 }] };
  }

  preview(id: string) {
    return { artboardId: id, previewUrl: "/uploads/landing.png" };
  }
}
