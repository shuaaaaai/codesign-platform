import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LayerNode } from "./layer-node.entity";
import { LayersController } from "./layers.controller";
import { LayersService } from "./layers.service";

@Module({
  imports: [TypeOrmModule.forFeature([LayerNode])],
  controllers: [LayersController],
  providers: [LayersService],
})
export class LayersModule {}
