import { Env } from "../../../../env";

export const dynamoConfig = {
  tableName: Env.DYNAMO_USER_TABLE,
  region: Env.AWS_REGION,
  endpoint: Env.DYNAMO_ENDPOINT, 
  partitionKey: "PK",
  sortKey: "SK",
};
