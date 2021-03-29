import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Session } from "../session.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "password") {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Session> {
    const user = await this.authService.validateCredentials(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
