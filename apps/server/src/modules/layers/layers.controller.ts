import { Controller, Get, Param, Query } from "@nestjs/common";
import { LayersService } from "./layers.service";

@Controller("layers")
export class LayersController {
  constructor(private readonly service: LayersService) {}

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Get(":id/code")
  code(@Param("id") id: string, @Query("format") format: string) {
    return this.service.code(id, format);
  }
}
