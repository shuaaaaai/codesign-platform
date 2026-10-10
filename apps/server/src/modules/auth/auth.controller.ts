import { Body, Controller, Get, Headers, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import type { JwtPayload } from "./jwt.strategy";

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.service.register(body);
  }

  @Post("login")
  login(@Body() body: LoginDto) {
    return this.service.login(body);
  }

  @Post("refresh")
  refresh(@Headers("x-refresh-token") refreshToken: string) {
    return this.service.refresh(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: Request & { user: JwtPayload }) {
    return this.service.getMe(req.user.sub);
  }
}
