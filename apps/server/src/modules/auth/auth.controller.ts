import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

class RegisterDto {
  email!: string;
  password!: string;
  name!: string;
}

class LoginDto {
  email!: string;
  password!: string;
}

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
  refresh() {
    return this.service.refresh();
  }
}
