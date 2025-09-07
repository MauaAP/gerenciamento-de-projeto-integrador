export enum StageEnum {
  PROD = "prod",
  DEV = "dev",
  TEST = "test",
}

export class Env {
  // Stage
  static readonly STAGE: StageEnum =
    (process.env.STAGE as StageEnum) || StageEnum.TEST;

  // DynamoDB
  static readonly DYNAMO_USER_TABLE: string =
    process.env.DYNAMO_USER_TABLE || "not_set";

  static readonly DYNAMO_REGION: string =
    process.env.DYNAMO_REGION || process.env.AWS_REGION || "not_set";
    
  // S3
  static readonly BUCKET_NAME: string = process.env.BUCKET_NAME || "not_set";

  // AWS
  static readonly AWS_ACCOUNT_ID: string =
    process.env.AWS_ACCOUNT_ID || "not_set";
  static readonly AWS_REGION: string = process.env.AWS_REGION || "not_set";

  // Secret (JWT etc)
  static readonly SECRET_KEY: string = process.env.SECRET_KEY || "not_set";
  static readonly JWT_SECRET: string = process.env.JWT_SECRET || "not_set";
}
