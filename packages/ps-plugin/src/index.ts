export type UploadTarget = "document" | "selected-artboard";

export async function uploadToCodeSign(target: UploadTarget, projectId: string, payload: Record<string, unknown>) {
  return {
    target,
    projectId,
    payload,
    status: "queued",
    id: "plugin-upload-1",
  };
}
