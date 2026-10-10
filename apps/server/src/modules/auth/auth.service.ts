import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { compare, hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { User } from "./user.entity";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: "15m" });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: "7d" });
    user.refreshTokenHash = await hash(refreshToken, 10);
    await this.userRepository.save(user);
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const passwordHash = await hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });
    const saved = await this.userRepository.save(user);
    const tokens = await this.issueTokens(saved);
    return {
      user: { id: saved.id, email: saved.email, name: saved.name, avatarUrl: saved.avatarUrl },
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException("账号或密码错误");
    }

    const valid = await compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("账号或密码错误");
    }

    const tokens = await this.issueTokens(user);
    return {
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<{ sub: string }>(refreshToken);
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException("刷新令牌无效");
    }

    const valid = await compare(refreshToken, user.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException("刷新令牌无效");
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email }, { expiresIn: "15m" });
    return { accessToken };
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("用户不存在");
    }
    return { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl };
  }
}
