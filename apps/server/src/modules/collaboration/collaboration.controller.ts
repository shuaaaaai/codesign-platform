import { Controller, Get } from "@nestjs/common";

@Controller("collaboration")
export class CollaborationController {
  @Get("presence")
  presence() {
    return { online: [] };
  }
}
