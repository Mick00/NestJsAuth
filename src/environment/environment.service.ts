import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";

export interface IEnv {
  ENVIRONMENT: "prod" | "dev" | "test";
  DB_TYPE: "postgres";
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

@Injectable()
export class EnvironmentService {
  private _env: IEnv;

  constructor() {
    this.load();
  }

  load() {
    const result = dotenv.config();
    if (result.error) {
      throw result.error;
    }
    this._env = (Object.assign(result.parsed, process.env) as unknown) as IEnv;
  }

  get env() {
    return this._env;
  }

  isProduction(): boolean {
    return this.env.ENVIRONMENT === "prod";
  }
}
