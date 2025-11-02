import type { DynamoDBResources } from "./dynamo_datasource";
import { GroupFilter, GroupUpdateOptions, IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { Group } from "app/shared/domain/entities/group";


export class GroupRepositoryDynamoDB implements IGroupRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }

  createGroup(group: Group): Promise<Group> {
    throw new Error("Method not implemented.");
  }
  
  fetchGroup(): Promise<Group[]> {
    throw new Error("Method not implemented.");
  }
  getGroupById(groupId: string): Promise<Group | null> {
    throw new Error("Method not implemented.");
  }

  getGroupByFilter(filter: GroupFilter): Promise<Group[] | null> {
    throw new Error("Method not implemented.");
  }

  deleteGroup(groupId: string): Promise<Group | null> {
    throw new Error("Method not implemented.");
  }
  updateGroup(groupId: string, updateOptions: GroupUpdateOptions): Promise<Group | null> {
    throw new Error("Method not implemented.");
  }
}
