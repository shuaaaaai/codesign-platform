import { Injectable } from "@nestjs/common";

@Injectable()
export class DesignFilesService {
  upload(body: { projectId: string; name: string; source: string }) {
    return { id: "df_1", ...body, previewUrl: "/uploads/preview.png", status: "queued" };
  }

  get(id: string) {
    return { id, name: "Homepage.psd", previewUrl: "/uploads/preview.png" };
  }

  artboards(id: string) {
    return { designFileId: id, artboards: [{ id: "ab_1", name: "Landing", width: 1440, height: 1024, previewUrl: "/uploads/landing.png" }] };
  }

  tokens(id: string) {
    return { designFileId: id, tokens: [{ id: "tok_1", name: "primary", value: "#0ea5e9" }] };
  }
}
