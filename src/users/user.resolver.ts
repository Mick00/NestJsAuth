import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { CurrentSession } from "../authentication/guards/session.decorator";
import { Session } from "../authentication/session.entity";

@Resolver(() => User)
export class UserResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  async findUser(
    @Args("username", { type: () => String }) username: string,
    @Args("uuid", { type: () => String }) uuid: string,
  ) {
    if (username) {
      return this.usersService.findByUsername(username);
    }
    if (uuid) {
      return this.usersService.findByUuid(uuid);
    }
  }

  @Mutation(() => String)
  async updateUser(
    @CurrentSession() session: Session,
    @Args("email", { type: () => String }) email: string,
  ) {
    await this.usersService.updateFromUuid(session.userUuid, {
      email,
    });
    return session.userUuid;
  }
}
