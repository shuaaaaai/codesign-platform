import { Injectable } from "@nestjs/common";
import type { Job } from "bullmq";
import { CollaborationGateway } from "../collaboration/collaboration.gateway";

@Injectable()
export class PsdProcessorService {
  constructor(private readonly collaborationGateway: CollaborationGateway) {}

  async process(job: Job<{ fileId: string }>) {
    if (job.name !== "parse") {
      return;
    }
    // 真实系统应在这里执行 MinIO 下载、PSD 解析、切图上传和数据库写入。
    this.collaborationGateway.emitParseProgress(job.data.fileId, 40, "解析图层");
    this.collaborationGateway.emitParseProgress(job.data.fileId, 70, "生成切图");
    this.collaborationGateway.emitParseProgress(job.data.fileId, 100, "写入数据库完成");
  }
}
