import { Body, Controller, Post } from "@nestjs/common";
import { IsEmail, IsString, MinLength } from "class-validator";
import { AuthService } from "./auth.service";

class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  name!: string;
}

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
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
