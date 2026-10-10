import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DesignFile } from "./design-file.entity";
import { Asset } from "./asset.entity";
import { DesignToken } from "./design-token.entity";
import { DesignFilesController } from "./design-files.controller";
import { DesignFilesService } from "./design-files.service";

@Module({
  imports: [TypeOrmModule.forFeature([DesignFile, Asset, DesignToken])],
  controllers: [DesignFilesController],
  providers: [DesignFilesService],
})
export class DesignFilesModule {}
