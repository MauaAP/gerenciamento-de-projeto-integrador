import type { DynamoDBResources } from "./dynamo_datasource";
import type { Project } from "../../../../shared/domain/entities/project";
import { IProjectRepository, ProjectUpdateOptions } from "../../../../shared/domain/interfaces/IProjectRepository";

export class ProjectRepositoryDynamoDB implements IProjectRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }
  createProject(project: Project): Promise<Project> {
    throw new Error("Method not implemented.");
  }
  fetchProjects(): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }
  getProjectById(projectId: string): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
  getProjectByPartnerId(partnerId: string): Promise<Project[] | null> {
    throw new Error("Method not implemented.");
  }  
  deleteProjectById(projectId: string): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
  updateProject(ProjectId: string, updateOptions: ProjectUpdateOptions): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
}
