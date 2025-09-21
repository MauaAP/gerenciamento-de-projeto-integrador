import { DynamoDBResources } from "./database/dynamo/dynamo_datasource";
import { UserRepoMock } from "./mocks/user_repository_mock";
import { UserRepositoryDynamoDB } from "./database/dynamo/user_repository_dynamo";
import { Env } from "../../env";
import type { IUserRepository } from "../domain/interfaces/IUserRepository";
import { dynamoConfig } from "./database/dynamo/dynamo_config";
import { IPartnerRepository } from "../domain/interfaces/IPartnerRepository";
import { PartnerRepoMock } from "./mocks/partner_repository_mock";
import { PartnerRepositoryDynamoDB } from "./database/dynamo/partner_repository_dynamo";

export class UserRepository {
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

export class PartnerRepository {
  public partnerRepo: IPartnerRepository;
  private dynamoDb?: DynamoDBResources;

  constructor() {
    if (Env.STAGE === "test") {
      this.partnerRepo = new PartnerRepoMock;
    } else {
      this.dynamoDb = new DynamoDBResources(dynamoConfig);
      this.partnerRepo = new PartnerRepositoryDynamoDB(this.dynamoDb);
    }
  }
}
