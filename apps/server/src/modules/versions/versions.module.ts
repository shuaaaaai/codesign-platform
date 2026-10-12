import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Artboard } from "../artboards/artboard.entity";
import { LayerNode } from "../layers/layer-node.entity";
import { Version } from "./version.entity";
import { VersionsController } from "./versions.controller";
import { VersionsService } from "./versions.service";

@Module({
  imports: [TypeOrmModule.forFeature([Version, Artboard, LayerNode])],
  controllers: [VersionsController],
  providers: [VersionsService],
  exports: [VersionsService],
})
export class VersionsModule {}
