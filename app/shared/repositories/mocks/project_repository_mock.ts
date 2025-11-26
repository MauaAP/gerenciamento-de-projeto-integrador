import { Project } from "../../domain/entities/project";
import { IProjectRepository, ProjectUpdateOptions } from "../../../shared/domain/interfaces/IProjectRepository";

export class ProjectRepoMock implements IProjectRepository {
    private projects: Project[] = [
        new Project(
            "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            "Desenvolvimento do site do Rokuzen",
            "61d2408e-8b16-402b-9ee8-e1d9bc9b2ab3",
        ),
        new Project(
            "81617d7c-662f-4fbc-803f-2cae90f5252f",
            "Criação de imagem do Poliedro",
            "574478f6-a764-4c0e-a24a-febad942156f"
        ),
        new Project(
            "805c6a8a-450e-414f-a257-bc8979d31f34",
            "Show do milhão poliedro",
            "574478f6-a764-4c0e-a24a-febad942156f",
            216000
        ),
        new Project(
            "d5e42571-48f2-4835-9311-d04deefefcd4",
            "Fazendo circuitos com a GM",
            "aeb4f4af-c60b-45d0-9355-868752ceb05f"
        ),
        new Project(
            "1e25ee35-da8a-4243-b1b3-f07d80e1fb5f",
            "Catraca digital do Metro de São Paulo",
            "418e7367-75f6-4732-ada4-16034fa7f41e",
            216000
        ),
        new Project(
            "4d2419c0-4955-4412-900f-e1d49b87f92b",
            "Bot de investimentos com a Mastercard",
            "ab077c10-674c-4b88-b4c5-38cb35ea0ef6",
        ),
        new Project(
            "37e8e903-b246-4a1c-8540-7461b8254ceb",
            "Cuidando do meio ambiente com a Klabin",
            "d2adbc85-d2f0-4a80-a4a8-ecaed50abaa8",
            216000
        )
    ]

    async createProject(project: Project): Promise<Project> {
        this.projects.push(project);
        return project;
    }

    async fetchProjects(): Promise<Project[]> {
        return this.projects
    }

    async getProjectById(projectId: string): Promise<Project | null> {
        return this.projects.find((project) => project.projectId === projectId) || null
    }

    async getProjectByPartnerId(partnerId: string): Promise<Project[] | null> {
        const result = this.projects.filter((project) => project.partnerId === partnerId)
        return result.length > 0 ? result : null
    }

    async getProjectByTitle(title: string): Promise<Project | null> {
        throw new Error("getProjectByTitle not implemented in mock");
    }

    async deleteProjectById(projectId: string): Promise<Project | null> {
        const index = this.projects.findIndex((project) => project.projectId === projectId);
        if (index === -1) {
            return null
        }
        return this.projects.splice(index, 1)[0]
    }

    async updateProject(projectId: string, updateOptions: ProjectUpdateOptions): Promise<Project | null> {
        const project = this.projects.find((project) => project.projectId === projectId) || null;

        if (project === null) {
            return null;
        }

        Object.assign(project, updateOptions);

        return project
    }
}