import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Session } from "./session.entity";
import { Public } from "./guards/public.decorator";
import { JWT_COOKIE_NAME } from "./strategies/jwt.strategy";
import { IGqlContext } from "../graphql/graphql.module";

@Resolver((of) => Session)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => Session, { nullable: true })
  async login(
    @Args("identifier", { type: () => String }) username: string,
    @Args("password", { type: () => String }) password: string,
    @Context() ctx: IGqlContext,
  ) {
    const user = await this.authService.validateCredentials(username, password);
    if (user) {
      const session = await this.authService.login(user);
      ctx.res.cookie(JWT_COOKIE_NAME, session.token, {
        httpOnly: true,
        expires: session.validUntil,
      });
      return session;
    }
    return null;
  }

  @Mutation(() => Session, { nullable: true })
  async register(
    @Args("identifier", { type: () => String }) username: string,
    @Args("password", { type: () => String }) password: string,
  ) {
    return this.authService.register(username, password);
  }
}
