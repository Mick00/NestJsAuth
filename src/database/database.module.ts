import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentModule } from "../environment/environment.module";
import { EnvironmentService } from "../environment/environment.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      useFactory: ({ env }: EnvironmentService) => ({
        type: env.DB_TYPE,
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        autoLoadEntities: true,
        synchronize: env.ENVIRONMENT !== "prod",
        logging: false,
      }),
      inject: [EnvironmentService],
    }),
  ],
})
export class DatabaseModule {}
