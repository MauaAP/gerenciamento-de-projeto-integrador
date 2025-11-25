import type { DynamoDBResources } from "./dynamo_datasource";
import { GroupFilter, GroupUpdateOptions, IGroupRepository } from "../../../../shared/domain/interfaces/IGroupRepository";
import { Group } from "../../../../shared/domain/entities/group";
import { ICourseRepository } from "../../../../shared/domain/interfaces/ICourseRepository";

function getGroupPK(groupId: string): string {
  return `GROUP#${groupId}`;
}

function getGroupSK(): string {
  return "METADATA";
}

function getAlunoPK(userId: string): string {
  return `ALUNO#${userId}`;
}

function getProjectPK(projectId: string): string {
  return `PROJECT#${projectId}`;
}

function getCoursePK(courseId: string): string {
  return `COURSE#${courseId}`;
}

function getCoursePKFromEnum(courseEnum: string): string {
  return `COURSE#${courseEnum}`;
}

export class GroupRepositoryDynamoDB implements IGroupRepository {
  private db: DynamoDBResources;
  private courseRepository?: ICourseRepository;

  constructor(db: DynamoDBResources, courseRepository?: ICourseRepository) {
    this.db = db;
    this.courseRepository = courseRepository;
  }

  async createGroup(group: Group): Promise<Group> {
    const pk = getGroupPK(group.groupId);
    const sk = getGroupSK();

    // Criar item principal: GROUP#ID + SK: METADATA
    const item = {
      PK: pk,
      SK: sk,
      ...group.toJson()
    };
    await this.db.put(item, pk, sk);

    // Criar relacionamentos: GROUP#ID + SK: ALUNO#ID (para cada aluno)
    for (const userId of group.userIdList) {
      const alunoPK = getAlunoPK(userId);
      const alunoRelationshipItem = {
        PK: pk,
        SK: `ALUNO#${userId}`,
        userId: userId
      };
      await this.db.put(alunoRelationshipItem, pk, `ALUNO#${userId}`);
      
      // Criar reverse lookup: ALUNO#ID + SK: GROUP#ID
      const reverseLookupItem = {
        PK: alunoPK,
        SK: `GROUP#${group.groupId}`,
        groupId: group.groupId
      };
      await this.db.put(reverseLookupItem, alunoPK, `GROUP#${group.groupId}`);
    }

    // Criar relacionamento: GROUP#ID + SK: PROJECT#ID
    const projectRelationshipItem = {
      PK: pk,
      SK: `PROJECT#${group.projectId}`,
      projectId: group.projectId
    };
    await this.db.put(projectRelationshipItem, pk, `PROJECT#${group.projectId}`);

    // Criar reverse lookup: PROJECT#ID + SK: GROUP#ID
    const projectPK = getProjectPK(group.projectId);
    const projectReverseLookupItem = {
      PK: projectPK,
      SK: `GROUP#${group.groupId}`,
      groupId: group.groupId
    };
    await this.db.put(projectReverseLookupItem, projectPK, `GROUP#${group.groupId}`);

    // Determinar courseId para usar nos relacionamentos
    let courseIdToUse: string | undefined = group.courseId;
    
    // Se courseId não está disponível mas temos courseRepository, buscar pelo enum
    if (!courseIdToUse && this.courseRepository) {
      const course = await this.courseRepository.getCourseByName(group.course);
      if (course) {
        courseIdToUse = course.courseId;
      }
    }

    // Criar relacionamento: GROUP#ID + SK: COURSE#ID ou COURSE#ENUM_VALUE
    const coursePK = courseIdToUse ? getCoursePK(courseIdToUse) : getCoursePKFromEnum(group.course);
    const courseSK = courseIdToUse ? `COURSE#${courseIdToUse}` : `COURSE#${group.course}`;
    
    const courseRelationshipItem = {
      PK: pk,
      SK: courseSK,
      course: group.course,
      ...(courseIdToUse && { courseId: courseIdToUse })
    };
    await this.db.put(courseRelationshipItem, pk, courseSK);

    // Criar reverse lookup: COURSE#ID ou COURSE#ENUM_VALUE + SK: GROUP#ID
    const courseReverseLookupItem = {
      PK: coursePK,
      SK: `GROUP#${group.groupId}`,
      groupId: group.groupId
    };
    await this.db.put(courseReverseLookupItem, coursePK, `GROUP#${group.groupId}`);

    console.log(`[DynamoDB] Grupo criado: ${pk}`);
    
    return group;
  }
  
  async fetchGroup(): Promise<Group[]> {
    const items = await this.db.scanAll({
      FilterExpression: "begins_with(#pk, :groupPrefix) AND #sk = :metadata",
      ExpressionAttributeNames: { 
        "#pk": "PK",
        "#sk": "SK"
      },
      ExpressionAttributeValues: { 
        ":groupPrefix": "GROUP#",
        ":metadata": "METADATA"
      },
    });
    console.log(`[DynamoDB] FetchGroup retornou ${items.length} itens`);
    return items.map(Group.fromJson);
  }

  async getGroupById(groupId: string): Promise<Group | null> {
    const pk = getGroupPK(groupId);
    const sk = getGroupSK();

    // Buscar item principal
    const mainItem = await this.db.get(pk, sk);

    if (!mainItem) {
      console.log(`[DynamoDB] Busca por ID: ${groupId} - Não encontrado`);
      return null;
    }

    // Buscar todos os relacionamentos para construir userIdList
    const allItems = await this.db.queryAll(pk);
    const userIdList: string[] = [];
    
    for (const item of allItems) {
      if (item.SK && item.SK.startsWith("ALUNO#")) {
        const userId = item.SK.replace("ALUNO#", "");
        userIdList.push(userId);
      }
    }

    // Se não encontrou alunos nos relacionamentos, usar os do item principal
    const finalGroup = {
      ...mainItem,
      userIdList: userIdList.length > 0 ? userIdList : (mainItem.userIdList || [])
    };

    console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
    return Group.fromJson(finalGroup);
  }

  async getGroupByFilter(filter: GroupFilter): Promise<Group[] | null> {
    let groups: Group[] = [];

    // Filtro por userId - Query ALUNO#ID + SK begins_with GROUP#
    if (filter.userId) {
      const alunoPK = getAlunoPK(filter.userId);
      const items = await this.db.queryAll(alunoPK, "GROUP#");
      
      const groupIds = items.map(item => item.groupId || item.SK?.replace("GROUP#", "")).filter(Boolean);
      
      for (const groupId of groupIds) {
        const group = await this.getGroupById(groupId);
        if (group) {
          groups.push(group);
        }
      }
    }

    // Filtro por projectId - Query PROJECT#ID + SK begins_with GROUP#
    if (filter.projectId) {
      const projectPK = getProjectPK(filter.projectId);
      const items = await this.db.queryAll(projectPK, "GROUP#");
      
      const groupIds = items.map(item => item.groupId || item.SK?.replace("GROUP#", "")).filter(Boolean);
      
      for (const groupId of groupIds) {
        const group = await this.getGroupById(groupId);
        if (group && !groups.find(g => g.groupId === group.groupId)) {
          groups.push(group);
        }
      }
    }

    // Filtro por courseId - Query COURSE#ID + SK begins_with GROUP# (eficiente)
    if (filter.courseId) {
      const coursePK = getCoursePK(filter.courseId);
      const items = await this.db.queryAll(coursePK, "GROUP#");
      
      const groupIds = items.map(item => item.groupId || item.SK?.replace("GROUP#", "")).filter(Boolean);
      
      for (const groupId of groupIds) {
        const group = await this.getGroupById(groupId);
        if (group && !groups.find(g => g.groupId === group.groupId)) {
          groups.push(group);
        }
      }
    }

    // Filtros por codSubj ou yearSem - Scan com FilterExpression
    if (filter.codSubj || filter.yearSem) {
      const filterConditions: string[] = [];
      const expressionAttributeNames: Record<string, string> = { "#pk": "PK", "#sk": "SK" };
      const expressionAttributeValues: Record<string, any> = { 
        ":groupPrefix": "GROUP#",
        ":metadata": "METADATA"
      };

      if (filter.codSubj) {
        filterConditions.push("#codSubj = :codSubj");
        expressionAttributeNames["#codSubj"] = "codSubj";
        expressionAttributeValues[":codSubj"] = filter.codSubj;
      }

      if (filter.yearSem) {
        filterConditions.push("#yearSem = :yearSem");
        expressionAttributeNames["#yearSem"] = "yearSem";
        expressionAttributeValues[":yearSem"] = filter.yearSem;
      }

      const filterExpression = `begins_with(#pk, :groupPrefix) AND #sk = :metadata AND ${filterConditions.join(" AND ")}`;
      
      const items = await this.db.scanAll({
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      for (const item of items) {
        const group = Group.fromJson(item);
        if (!groups.find(g => g.groupId === group.groupId)) {
          groups.push(group);
        }
      }
    }

    // Se nenhum filtro foi aplicado, retornar todos os grupos
    if (!filter.userId && !filter.projectId && !filter.courseId && !filter.codSubj && !filter.yearSem) {
      return await this.fetchGroup();
    }

    console.log(`[DynamoDB] Busca por filtro retornou ${groups.length} grupos`);
    return groups.length > 0 ? groups : null;
  }

  async deleteGroup(groupId: string): Promise<Group | null> {
    const group = await this.getGroupById(groupId);

    if (!group) {
      return null;
    }

    const pk = getGroupPK(groupId);
    const sk = getGroupSK();

    // Deletar item principal
    await this.db.delete(pk, sk);

    // Deletar todos os relacionamentos: GROUP#ID + SK: ALUNO#ID
    for (const userId of group.userIdList) {
      await this.db.delete(pk, `ALUNO#${userId}`);
      
      // Deletar reverse lookup: ALUNO#ID + SK: GROUP#ID
      const alunoPK = getAlunoPK(userId);
      await this.db.delete(alunoPK, `GROUP#${groupId}`);
    }

    // Deletar relacionamento: GROUP#ID + SK: PROJECT#ID
    await this.db.delete(pk, `PROJECT#${group.projectId}`);

    // Deletar reverse lookup: PROJECT#ID + SK: GROUP#ID
    const projectPK = getProjectPK(group.projectId);
    await this.db.delete(projectPK, `GROUP#${groupId}`);

    // Deletar relacionamento: GROUP#ID + SK: COURSE#ID ou COURSE#ENUM_VALUE
    const courseSK = group.courseId ? `COURSE#${group.courseId}` : `COURSE#${group.course}`;
    await this.db.delete(pk, courseSK);

    // Deletar reverse lookup: COURSE#ID ou COURSE#ENUM_VALUE + SK: GROUP#ID
    const coursePK = group.courseId ? getCoursePK(group.courseId) : getCoursePKFromEnum(group.course);
    await this.db.delete(coursePK, `GROUP#${groupId}`);

    console.log(`[DynamoDB] Grupo deletado: ${pk}`);

    return group;
  }

  async updateGroup(groupId: string, updateOptions: GroupUpdateOptions): Promise<Group | null> {
    const currentGroup = await this.getGroupById(groupId);

    if (!currentGroup) {
      return Promise.resolve(null);
    }

    const pk = getGroupPK(groupId);
    const sk = getGroupSK();

    const updateDict: Partial<Group> = {};

    if (updateOptions.codSubj) updateDict.codSubj = updateOptions.codSubj;
    if (updateOptions.userIdList) {
      // Se userIdList mudou, precisamos atualizar os relacionamentos
      // Primeiro, deletar relacionamentos antigos
      for (const oldUserId of currentGroup.userIdList) {
        await this.db.delete(pk, `ALUNO#${oldUserId}`);
        const alunoPK = getAlunoPK(oldUserId);
        await this.db.delete(alunoPK, `GROUP#${groupId}`);
      }
      
      // Criar novos relacionamentos
      for (const newUserId of updateOptions.userIdList) {
        const alunoRelationshipItem = {
          PK: pk,
          SK: `ALUNO#${newUserId}`,
          userId: newUserId
        };
        await this.db.put(alunoRelationshipItem, pk, `ALUNO#${newUserId}`);
        
        const alunoPK = getAlunoPK(newUserId);
        const reverseLookupItem = {
          PK: alunoPK,
          SK: `GROUP#${groupId}`,
          groupId: groupId
        };
        await this.db.put(reverseLookupItem, alunoPK, `GROUP#${groupId}`);
      }
      
      updateDict.userIdList = updateOptions.userIdList;
    }
    if (updateOptions.yearSem) updateDict.yearSem = updateOptions.yearSem;
    if (updateOptions.projectId) {
      // Se projectId mudou, atualizar relacionamentos
      // Deletar relacionamento antigo
      await this.db.delete(pk, `PROJECT#${currentGroup.projectId}`);
      const oldProjectPK = getProjectPK(currentGroup.projectId);
      await this.db.delete(oldProjectPK, `GROUP#${groupId}`);
      
      // Criar novo relacionamento
      const projectRelationshipItem = {
        PK: pk,
        SK: `PROJECT#${updateOptions.projectId}`,
        projectId: updateOptions.projectId
      };
      await this.db.put(projectRelationshipItem, pk, `PROJECT#${updateOptions.projectId}`);
      
      const newProjectPK = getProjectPK(updateOptions.projectId);
      const projectReverseLookupItem = {
        PK: newProjectPK,
        SK: `GROUP#${groupId}`,
        groupId: groupId
      };
      await this.db.put(projectReverseLookupItem, newProjectPK, `GROUP#${groupId}`);
      
      updateDict.projectId = updateOptions.projectId;
    }
    if (updateOptions.course) {
      // Se course mudou, atualizar relacionamentos
      // Determinar courseId para usar nos relacionamentos
      let courseIdToUse: string | undefined = updateOptions.courseId;
      
      // Se courseId não está disponível mas temos courseRepository, buscar pelo enum
      if (!courseIdToUse && this.courseRepository) {
        const course = await this.courseRepository.getCourseByName(updateOptions.course);
        if (course) {
          courseIdToUse = course.courseId;
        }
      }

      // Deletar relacionamento antigo (pode ser por courseId ou enum)
      const oldCourseSK = currentGroup.courseId ? `COURSE#${currentGroup.courseId}` : `COURSE#${currentGroup.course}`;
      await this.db.delete(pk, oldCourseSK);
      const oldCoursePK = currentGroup.courseId ? getCoursePK(currentGroup.courseId) : getCoursePKFromEnum(currentGroup.course);
      await this.db.delete(oldCoursePK, `GROUP#${groupId}`);
      
      // Criar novo relacionamento usando courseId se disponível
      const newCoursePK = courseIdToUse ? getCoursePK(courseIdToUse) : getCoursePKFromEnum(updateOptions.course);
      const newCourseSK = courseIdToUse ? `COURSE#${courseIdToUse}` : `COURSE#${updateOptions.course}`;
      
      const courseRelationshipItem = {
        PK: pk,
        SK: newCourseSK,
        course: updateOptions.course,
        ...(courseIdToUse && { courseId: courseIdToUse })
      };
      await this.db.put(courseRelationshipItem, pk, newCourseSK);
      
      const courseReverseLookupItem = {
        PK: newCoursePK,
        SK: `GROUP#${groupId}`,
        groupId: groupId
      };
      await this.db.put(courseReverseLookupItem, newCoursePK, `GROUP#${groupId}`);
      
      updateDict.course = updateOptions.course;
      if (courseIdToUse) {
        updateDict.courseId = courseIdToUse;
      }
    }
    
    // Se apenas courseId foi fornecido (sem course), atualizar relacionamentos também
    if (updateOptions.courseId && !updateOptions.course && currentGroup.courseId !== updateOptions.courseId) {
      // Deletar relacionamento antigo
      const oldCourseSK = currentGroup.courseId ? `COURSE#${currentGroup.courseId}` : `COURSE#${currentGroup.course}`;
      await this.db.delete(pk, oldCourseSK);
      const oldCoursePK = currentGroup.courseId ? getCoursePK(currentGroup.courseId) : getCoursePKFromEnum(currentGroup.course);
      await this.db.delete(oldCoursePK, `GROUP#${groupId}`);
      
      // Criar novo relacionamento usando o novo courseId
      const newCoursePK = getCoursePK(updateOptions.courseId);
      const newCourseSK = `COURSE#${updateOptions.courseId}`;
      
      const courseRelationshipItem = {
        PK: pk,
        SK: newCourseSK,
        course: currentGroup.course,
        courseId: updateOptions.courseId
      };
      await this.db.put(courseRelationshipItem, pk, newCourseSK);
      
      const courseReverseLookupItem = {
        PK: newCoursePK,
        SK: `GROUP#${groupId}`,
        groupId: groupId
      };
      await this.db.put(courseReverseLookupItem, newCoursePK, `GROUP#${groupId}`);
      
      updateDict.courseId = updateOptions.courseId;
    }

    const updatedGroup = await this.db.update(pk, sk, updateDict);

    console.log(`[DynamoDB] Grupo atualizado: ${pk}`);

    return Group.fromJson(updatedGroup);
  }
}