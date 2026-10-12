import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DesignFile } from "./design-file.entity";
import { Asset } from "./asset.entity";
import { DesignToken } from "./design-token.entity";
import { DesignFilesController } from "./design-files.controller";
import { DesignFilesService } from "./design-files.service";
import { Artboard } from "../artboards/artboard.entity";
import { LayerNode } from "../layers/layer-node.entity";
import { CollaborationModule } from "../collaboration/collaboration.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([DesignFile, Asset, DesignToken, Artboard, LayerNode]), CollaborationModule, AuthModule],
  controllers: [DesignFilesController],
  providers: [DesignFilesService],
  exports: [DesignFilesService],
})
export class DesignFilesModule {}
