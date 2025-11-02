import type { DynamoDBResources } from "./dynamo_datasource";
import { GroupFilter, GroupUpdateOptions, IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { Group } from "app/shared/domain/entities/group";

function getGroupPK(groupId: string): string {
  return `GROUP#${groupId}`;
}

function getGroupSK(): string {
  return "METADATA";
}


export class GroupRepositoryDynamoDB implements IGroupRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }

  async createGroup(group: Group): Promise<Group> {
    const pk= getGroupPK(group.groupId);
    const sk= getGroupSK();

    const item= {
      PK: pk,
      SK: sk,
      ...group.toJson()
    };

    await this.db.put(item, pk, sk);
    console.log(`[DynamoDB] Grupo criado: ${pk} - ${group}`);
    
    return group
  }
  
  fetchGroup(): Promise<Group[]> {
    throw new Error("Method not implemented.");
  }

  async getGroupById(groupId: string): Promise<Group | null> {
    const pk= getGroupPK(groupId);
    const sk= getGroupSK();

    const item= await this.db.get(pk, sk)

    if(item){
      console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
      return Group.fromJson(item);
    }

    console.log(`[DynamoDB] Busca por ID: ${groupId} - Não encontrado`);

    return null
  }

  getGroupByFilter(filter: GroupFilter): Promise<Group[] | null> {
    throw new Error("Method not implemented.");
  }

  async deleteGroup(groupId: string): Promise<Group | null> {
    const group= this.getGroupById(groupId);

    if(!group)
      return null

    const pk= getGroupPK(groupId);
    const sk= getGroupSK();

    this.db.delete(pk, sk);

    console.log(`[DynamoDB] Grupo deletado: ${pk}`);

    return group;
  }

  async updateGroup(groupId: string, updateOptions: GroupUpdateOptions): Promise<Group | null> {
    const currentGroup= this.getGroupById(groupId);

    if(!currentGroup)
      return Promise.resolve(null);

    const pk= getGroupPK(groupId);
    const sk= getGroupSK();

    const updateDict: Partial<Group> = {};

    if(updateOptions.codSubj) updateDict.codSubj= updateOptions.codSubj;
    if(updateOptions.userIdList) updateDict.userIdList= updateOptions.userIdList;
    if(updateOptions.yearSem) updateDict.yearSem= updateOptions.yearSem;
    if(updateOptions.projectId) updateDict.projectId= updateOptions.projectId;
    if(updateOptions.course) updateDict.course= updateOptions.course;

    const updatedGroup= await this.db.update(pk, sk, updateDict);

    console.log(`[DynamoDB] Grupo atualizado: ${pk}`);

    return Group.fromJson(updatedGroup);
  }
}
