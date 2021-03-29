import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { EnvironmentService } from "../../environment/environment.service";
import { AnonymousSession, Session } from "../session.entity";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

export const JWT_COOKIE_NAME = "led_auth_token";

const jwtCookieExtractor = (cookieName: string) => {
  return ({ cookies }: Request) => {
    if (cookies) {
      return cookies[cookieName] ? cookies[cookieName] : null;
    }
    return null;
  };
};

const extractJwt = jwtCookieExtractor(JWT_COOKIE_NAME);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor({ env }: EnvironmentService, private jwtService: JwtService) {
    super({
      jwtFromRequest: extractJwt,
      secretOrKey: env.JWT_SECRET,
    });
  }

  authenticate(req: Request, options?: any) {
    const token = extractJwt(req);
    if (!token && options.isPublic) {
      this.authAsAnon();
      return;
    }
    try {
      let session: Session = this.jwtService.verify(token);
      session = this.validate(session);
      this.success(session, options);
    } catch (error) {
      if (options.isPublic) {
        this.authAsAnon();
      } else {
        this.error(new UnauthorizedException());
      }
    }
  }

  private authAsAnon() {
    this.success(new AnonymousSession());
  }

  validate(session: Session): Session {
    return Object.assign(new Session(), session);
  }
}
