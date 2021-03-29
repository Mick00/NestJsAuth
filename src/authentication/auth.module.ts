import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "../environment/environment.service";
import { EnvironmentModule } from "../environment/environment.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./session.entity";
import { AuthResolver } from "./auth.resolver";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    UsersModule,
    EnvironmentModule,
    TypeOrmModule.forFeature([Session]),
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      useFactory: ({ env }: EnvironmentService) => ({
        secret: env.JWT_SECRET,
        signOptions: { expiresIn: env.JWT_EXPIRES_IN },
      }),
      inject: [EnvironmentService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver],
  exports: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
