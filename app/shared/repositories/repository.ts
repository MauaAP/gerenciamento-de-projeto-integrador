import { DynamoDBResources } from "./database/dynamo/dynamo_datasource";
import { UserRepoMock } from "./mocks/user_repository_mock";
import { UserRepositoryDynamoDB } from "./database/dynamo/user_repository_dynamo";
import { Env } from "../../env";
import type { IUserRepository } from "../domain/interfaces/IUserRepository";
import { dynamoConfig } from "./database/dynamo/dynamo_config";
import { IPartnerRepository } from "../domain/interfaces/IPartnerRepository";
import { PartnerRepoMock } from "./mocks/partner_repository_mock";
import { PartnerRepositoryDynamoDB } from "./database/dynamo/partner_repository_dynamo";
import { IProjectRepository } from "../domain/interfaces/IProjectRepository";
import { ProjectRepoMock } from "./mocks/project_repository_mock";
import { ProjectRepositoryDynamoDB } from "./database/dynamo/project_repository_dynamo";
import { IGroupRepository } from "../domain/interfaces/IGroupRepository";
import { GroupRepoMock } from "./mocks/group_repository_mock";
import { GroupRepositoryDynamoDB } from "./database/dynamo/group_repository_dynamo";
import { IExaminationBoardRepository } from "../domain/interfaces/IExaminationBoardRepository";
import { ExaminationBoardRepoMock } from "./mocks/examiantion_board_repository_mock";
import { ExaminationBoardRepositoryDynamoDB } from "./database/dynamo/examination_board_repository_dynamo";

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
export class ProjectRepository{
  public partnerRepo: IPartnerRepository;
  public projectRepo: IProjectRepository;
  private dynamoDb?: DynamoDBResources;

  constructor() {
    if (Env.STAGE === "test") {
      this.partnerRepo = new PartnerRepoMock;
      this.projectRepo = new ProjectRepoMock;
    } else {
      this.dynamoDb = new DynamoDBResources(dynamoConfig);
      this.partnerRepo = new PartnerRepositoryDynamoDB(this.dynamoDb);
      this.projectRepo= new ProjectRepositoryDynamoDB(this.dynamoDb)
    }
  }
}

export class GroupRepository{
  public groupRepo: IGroupRepository;
  public userRepo: IUserRepository;
  public projectRepo: IProjectRepository;
  private dynamoDb?: DynamoDBResources;

  constructor() {
    if (Env.STAGE === "test") {
      this.groupRepo = new GroupRepoMock;
      this.userRepo= new UserRepoMock;
      this.projectRepo= new ProjectRepoMock;
    } else{
      this.dynamoDb = new DynamoDBResources(dynamoConfig);
      this.groupRepo = new GroupRepositoryDynamoDB(this.dynamoDb)
      this.userRepo = new UserRepositoryDynamoDB(this.dynamoDb)
      this.projectRepo = new ProjectRepositoryDynamoDB(this.dynamoDb)
    }
  }
}

export class ExaminationBoardRepository{
  public examinationBoardRepo: IExaminationBoardRepository;
  public userRepo: IUserRepository;
  private dynamoDb?: DynamoDBResources;

  constructor() {
    if (Env.STAGE === "test") {
      this.examinationBoardRepo= new ExaminationBoardRepoMock;
      this.userRepo= new UserRepoMock;
    } else {
      this.dynamoDb= new DynamoDBResources(dynamoConfig);
      this.examinationBoardRepo= new ExaminationBoardRepositoryDynamoDB(this.dynamoDb);
      this.userRepo= new UserRepositoryDynamoDB(this.dynamoDb);
    }
  }
}
