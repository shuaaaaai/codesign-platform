import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  register(payload: { email: string; password: string; name: string }) {
    return {
      user: { id: "u_1", email: payload.email, name: payload.name },
      token: "mock-jwt-token",
    };
  }

  login(payload: { email: string; password: string }) {
    return {
      user: { id: "u_1", email: payload.email },
      token: "mock-jwt-token",
    };
  }

  refresh() {
    return { token: "refreshed-mock-jwt-token" };
  }
}
