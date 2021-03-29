import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import { isPublic } from "./public.decorator";

@Injectable()
export class GraphqlJwtGuard extends AuthGuard("jwt") {
  getAuthenticateOptions(context: ExecutionContext) {
    const superOptions = super.getAuthenticateOptions(context);
    return { ...superOptions, isPublic: isPublic(context) };
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
