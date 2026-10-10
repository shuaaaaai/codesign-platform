import { Injectable } from "@nestjs/common";

@Injectable()
export class LayersService {
  get(id: string) {
    return { id, name: "Hero Button", type: "button", x: 320, y: 200, width: 180, height: 56 };
  }

  code(id: string, format: string) {
    const target = format || "css";
    return { layerId: id, format: target, code: `.button {
  display: inline-flex;
  border-radius: 16px;
  background: #0ea5e9;
  color: white;
}` };
  }
}
