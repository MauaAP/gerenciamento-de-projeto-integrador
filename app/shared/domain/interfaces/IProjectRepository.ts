import { Project } from "../entities/project";

export interface IProjectRepository {
    createProject(project: Project): Promise<Project>;

    fetchProjects(): Promise<Project[]>

    getProjectById(projectId: string): Promise<Project | null>

    getProjectByPartnerId(partnerId: string): Promise<Project[] | null>

    deleteProjectById(projectId: string): Promise<Project>
}