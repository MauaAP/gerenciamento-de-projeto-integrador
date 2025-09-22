// Centralização de configuração do DynamoDB e variáveis de ambiente

import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export enum StageEnum {
  PROD = "prod",
  DEV = "dev",
  TEST = "test",
  LOCAL = "local",
}

export class Env {
  // Stage
  static readonly STAGE: StageEnum =
    (process.env.STAGE as StageEnum) || StageEnum.LOCAL;

  // AWS
  static readonly AWS_REGION: string =
    process.env.AWS_REGION || "us-east-1"; // fallback para N. Virginia
  static readonly AWS_ACCOUNT_ID: string =
    process.env.AWS_ACCOUNT_ID || "not_set";

  // DynamoDB
  static readonly DYNAMO_USER_TABLE: string =
    process.env.DYNAMO_USER_TABLE || "not_set";
  static readonly DYNAMO_ENDPOINT: string | undefined =
    process.env.DYNAMO_ENDPOINT; // só usar se for local

  // S3
  static readonly BUCKET_NAME: string = process.env.BUCKET_NAME || "not_set";

  // JWT / Secrets
  static readonly JWT_SECRET: string = process.env.JWT_SECRET || "not_set";
  static readonly JWT_EXPIRES_IN: string =
    process.env.JWT_EXPIRES_IN || "1h"; // default 1h
}
