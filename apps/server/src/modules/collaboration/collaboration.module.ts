import { Module } from "@nestjs/common";
import { CollaborationController } from "./collaboration.controller";
import { CollaborationGateway } from "./collaboration.gateway";

@Module({
  controllers: [CollaborationController],
  providers: [CollaborationGateway],
  exports: [CollaborationGateway],
})
export class CollaborationModule {}
