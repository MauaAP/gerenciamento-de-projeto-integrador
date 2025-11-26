import { Project } from "../entities/project";

export type ProjectUpdateOptions = {
    title?: string,
    partnerId?: string,
    extensionHours?: number //seconds
}

export interface IProjectRepository {
    createProject(project: Project): Promise<Project>;

    fetchProjects(): Promise<Project[]>

    getProjectById(projectId: string): Promise<Project | null>

    getProjectByPartnerId(partnerId: string): Promise<Project[] | null>
    //metodo que eu adicionei a baixo
    getProjectByTitle(title: string): Promise<Project | null>

    deleteProjectById(projectId: string): Promise<Project | null>

    updateProject(projectId: string, updateOptions: ProjectUpdateOptions): Promise<Project | null>;
}