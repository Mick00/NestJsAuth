import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { EnvironmentModule } from "../environment/environment.module";
import { EnvironmentService } from "../environment/environment.service";
import { Response, Request } from "express";

export interface IGqlContext {
  res: Response;
  req: Request;
}

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [EnvironmentModule],
      useFactory: (env: EnvironmentService) => ({
        debug: !env.isProduction(),
        playground: !env.isProduction(),
        autoSchemaFile: process.cwd() + "/src/graphql/schema.gql",
        sortSchema: true,
        credentials: true,
        origin: true,
        context: (ctx): IGqlContext => ctx,
      }),
      inject: [EnvironmentService],
    }),
  ],
})
export class ApiModule {}
