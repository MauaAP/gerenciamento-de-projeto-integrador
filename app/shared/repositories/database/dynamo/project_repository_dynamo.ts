import type { DynamoDBResources } from "./dynamo_datasource";
import { Project } from "../../../../shared/domain/entities/project";
import { IProjectRepository, ProjectUpdateOptions } from "../../../../shared/domain/interfaces/IProjectRepository";

function getProjectPK(projectId: string): string {
  return `PROJECT#${projectId}`;
}

function getProjectSK(): string {
  return "METADATA";
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
    console.log(`[DynamoDB] Projeto criado: ${pk} - ${project.title}`);
    
    return project
  }

  fetchProjects(): Promise<Project[]> {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }
  
  async deleteProjectById(projectId: string): Promise<Project | null> {
    const project= await this.getProjectById(projectId);

    if(!project)
      return null

    const pk= getProjectPK(projectId);
    const sk= getProjectSK();

    await this.db.delete(pk, sk);
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
    if(updateOptions.partnerId) updateDict.partnerId= updateOptions.partnerId;
    if(updateOptions.extensionHours) updateDict.extensionHours= updateOptions.extensionHours;

    const updated= await this.db.update(pk, sk, updateDict);
    console.log(`[DynamoDB] Projeto atualizado: ${pk}`);

    return Project.fromJson(updated);
  }
}
