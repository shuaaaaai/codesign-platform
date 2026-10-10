import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Artboard } from "./artboard.entity";
import { ArtboardsController } from "./artboards.controller";
import { ArtboardsService } from "./artboards.service";

@Module({
  imports: [TypeOrmModule.forFeature([Artboard])],
  controllers: [ArtboardsController],
  providers: [ArtboardsService],
})
export class ArtboardsModule {}
