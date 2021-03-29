import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GraphqlJwtGuard } from "./authentication/guards/graphqlJwt.guard";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new GraphqlJwtGuard());
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
