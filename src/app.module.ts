import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EnvironmentModule } from "./environment/environment.module";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./authentication/auth.module";
import { ApiModule } from "./graphql/graphql.module";

@Module({
  imports: [
    EnvironmentModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
