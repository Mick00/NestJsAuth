import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import { Session } from "./session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async register(username: string, password: string): Promise<Session> {
    const user = await this.usersService.registerUser(username, password);
    return await this.startSession(user);
  }

  async validateCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    return await this.startSession(user);
  }

  private async startSession(user: User): Promise<Session> {
    let session = new Session();
    session.user = Promise.resolve(user);
    session.start();
    session = await this.sessionsRepository.save(session);
    const { validUntil, startedAt, uuid } = session;
    const sessionObject = {
      validUntil,
      startedAt,
      uuid,
      userUuid: user.uuid,
    };
    session.token = this.jwtService.sign(sessionObject);
    return session;
  }

  async refreshSession(session: Session) {
    session.extend();
    return await this.sessionsRepository.save(session);
  }

  wrapSession(session: any): Session {
    return Object.assign(new Session(), session);
  }
}
