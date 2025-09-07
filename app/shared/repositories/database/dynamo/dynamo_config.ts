// Centralização de configuração do DynamoDB

import { Env } from "../../../../env";

export const dynamoConfig = {
  tableName: Env.DYNAMO_USER_TABLE,
  region: Env.AWS_REGION,
  endpoint: process.env.DYNAMO_ENDPOINT,
  partitionKey: "PK",
  sortKey: "SK",
};
