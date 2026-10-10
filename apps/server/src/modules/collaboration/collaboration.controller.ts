import { Controller, Get } from "@nestjs/common";

@Controller("collaboration")
export class CollaborationController {
  @Get("presence")
  presence() {
    return { online: [{ id: "u_1", name: "Alice" }, { id: "u_2", name: "Ben" }] };
  }
}
