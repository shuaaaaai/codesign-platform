import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Artboard } from "./artboard.entity";
import { ArtboardsController } from "./artboards.controller";
import { ArtboardsService } from "./artboards.service";
import { LayerNode } from "../layers/layer-node.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Artboard, LayerNode]), AuthModule],
  controllers: [ArtboardsController],
  providers: [ArtboardsService],
})
export class ArtboardsModule {}
