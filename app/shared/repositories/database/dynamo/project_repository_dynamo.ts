import type { DynamoDBResources } from "./dynamo_datasource";
import { Project } from "../../../../shared/domain/entities/project";
import { IProjectRepository, ProjectUpdateOptions } from "../../../../shared/domain/interfaces/IProjectRepository";

function getProjectPK(projectId: string): string {
  return `PROJECT#${projectId}`;
}

function getProjectSK(): string {
  return "METADATA";
}

function getPartnerPK(partnerId: string): string {
  return `PARTNER#${partnerId}`;
}

export class ProjectRepositoryDynamoDB implements IProjectRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }
  async createProject(project: Project): Promise<Project> {
    const pk= getProjectPK(project.projectId);
    const sk= getProjectSK();

    const item= {
      PK: pk,
      SK: sk,
      ...project.toJson()
    };

    await this.db.put(item, pk, sk);
    
    // Criar relacionamento bidirecional: PARTNER#ID + SK: PROJECT#ID
    const partnerPK = getPartnerPK(project.partnerId);
    const relationshipItem = {
      PK: partnerPK,
      SK: `PROJECT#${project.projectId}`,
      projectId: project.projectId,
      title: project.title
    };
    await this.db.put(relationshipItem, partnerPK, `PROJECT#${project.projectId}`);
    
    console.log(`[DynamoDB] Projeto criado: ${pk} - ${project.title}`);
    
    return project
  }

  async fetchProjects(): Promise<Project[]> {
    const items = await this.db.scanAll({
      FilterExpression: "begins_with(#pk, :projectPrefix) AND #sk = :metadata",
      ExpressionAttributeNames: { 
        "#pk": "PK",
        "#sk": "SK"
      },
      ExpressionAttributeValues: { 
        ":projectPrefix": "PROJECT#",
        ":metadata": "METADATA"
      },
    });
    console.log(`[DynamoDB] FetchProjects retornou ${items.length} itens`);
    return items.map(Project.fromJson);
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    const pk= getProjectPK(projectId);
    const sk= getProjectSK();

    const item= await this.db.get(pk, sk)

    if(item){
      console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
      return Project.fromJson(item);
    }

    console.log(`[DynamoDB] Busca por ID: ${projectId} - Não encontrado`);

    return null
  }

  async getProjectByPartnerId(partnerId: string): Promise<Project[] | null> {
    const partnerPK = getPartnerPK(partnerId);
    const items = await this.db.queryAll(
      partnerPK,
      "PROJECT#"
    );
    
    if (items.length === 0) {
      console.log(`[DynamoDB] Busca por PartnerId: ${partnerId} - Nenhum projeto encontrado`);
      return null;
    }
    
    // Buscar os projetos completos usando os IDs encontrados
    const projects: Project[] = [];
    for (const item of items) {
      if (item.projectId) {
        const project = await this.getProjectById(item.projectId);
        if (project) {
          projects.push(project);
        }
      }
    }
    
    console.log(`[DynamoDB] Busca por PartnerId: ${partnerId} - ${projects.length} projetos encontrados`);
    return projects.length > 0 ? projects : null;
  }
  
  //implementação do metodo que eu adicionei
  async getProjectByTitle(title: string): Promise<Project | null> {
    const items = await this.db.scanAll({
      FilterExpression: "#title = :title AND begins_with(#pk, :projectPrefix) AND #sk = :metadata",
      ExpressionAttributeNames: { 
        "#title": "title",
        "#pk": "PK",
        "#sk": "SK"
      },
      ExpressionAttributeValues: { 
        ":title": title,
        ":projectPrefix": "PROJECT#",
        ":metadata": "METADATA"
      },
    });
    console.log(
      `[DynamoDB] Busca por título: ${title} - ${
        items.length > 0 ? "Encontrado" : "Não encontrado"
      }`
    );
    return items.length > 0 ? Project.fromJson(items[0]) : null;
  }
  
  async deleteProjectById(projectId: string): Promise<Project | null> {
    const project= await this.getProjectById(projectId);

    if(!project)
      return null

    const pk= getProjectPK(projectId);
    const sk= getProjectSK();

    await this.db.delete(pk, sk);
    
    // Deletar relacionamento bidirecional: PARTNER#ID + SK: PROJECT#ID
    const partnerPK = getPartnerPK(project.partnerId);
    await this.db.delete(partnerPK, `PROJECT#${projectId}`);
    
    console.log(`[DynamoDB] Projeto deletado: ${pk} - ${project.title}`);

    return project;

  }

  async updateProject(ProjectId: string, updateOptions: ProjectUpdateOptions): Promise<Project | null> {
    const currentProject= await this.getProjectById(ProjectId);

    if(!currentProject)
      return null;

    const pk= getProjectPK(currentProject.projectId);
    const sk= getProjectSK();

    const updateDict: Partial<Project>= {};

    if(updateOptions.title) updateDict.title= updateOptions.title;
    
    // Atualizar relacionamento bidirecional quando partnerId mudar
    if(updateOptions.partnerId && updateOptions.partnerId !== currentProject.partnerId) {
      // Deletar relacionamento antigo: PARTNER#OLD_ID + SK: PROJECT#ID
      const oldPartnerPK = getPartnerPK(currentProject.partnerId);
      await this.db.delete(oldPartnerPK, `PROJECT#${currentProject.projectId}`);
      
      // Criar novo relacionamento: PARTNER#NEW_ID + SK: PROJECT#ID
      const newPartnerPK = getPartnerPK(updateOptions.partnerId);
      const relationshipItem = {
        PK: newPartnerPK,
        SK: `PROJECT#${currentProject.projectId}`,
        projectId: currentProject.projectId,
        title: updateOptions.title || currentProject.title
      };
      await this.db.put(relationshipItem, newPartnerPK, `PROJECT#${currentProject.projectId}`);
    }
    
    if(updateOptions.partnerId) updateDict.partnerId= updateOptions.partnerId;
    if(updateOptions.extensionHours) updateDict.extensionHours= updateOptions.extensionHours;

    const updated= await this.db.update(pk, sk, updateDict);
    console.log(`[DynamoDB] Projeto atualizado: ${pk}`);

    return Project.fromJson(updated);
  }
}
