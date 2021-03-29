import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async registerUser(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = password;
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ username });
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return this.usersRepository.findOne({ uuid });
  }

  async update(user: User, update: Partial<User>) {
    this.usersRepository.merge(user, update);
    await this.usersRepository.save(user);
    return user;
  }

  async updateFromUuid(uuid: string, update: Partial<User>) {
    await this.usersRepository.update({ uuid }, update);
  }

  async wrap(user: any) {
    return this.usersRepository.create(user);
  }
}
