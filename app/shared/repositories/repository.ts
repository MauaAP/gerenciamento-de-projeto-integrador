import { DynamoDBResources } from "./database/dynamo/dynamo_datasource";
import { UserRepoMock } from "./mocks/user_repository_mock";
import { UserRepositoryDynamoDB } from "./database/dynamo/user_repository_dynamo";
import { Env } from "../../env";
import type { IUserRepository } from "../domain/interfaces/IUserRepository";
import { dynamoConfig } from "./database/dynamo/dynamo_config";

export class Repository {
  public userRepo: IUserRepository;
  private dynamoDb?: DynamoDBResources;

  constructor() {
    if (Env.STAGE === "test") {
      this.userRepo = new UserRepoMock();
    } else {
      this.dynamoDb = new DynamoDBResources(dynamoConfig);
      this.userRepo = new UserRepositoryDynamoDB(this.dynamoDb);
    }
  }
}
