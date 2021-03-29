import { ExecutionContext, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const Public = () => SetMetadata("isPublic", true);

export const isPublic = (context: ExecutionContext) => {
  const reflector = new Reflector();
  return !!reflector.get<boolean>("isPublic", context.getHandler());
};
