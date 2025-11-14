import { Project } from "../../../shared/domain/entities/project";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeleteProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository) {}

    async execute(id: string): Promise<Project> {
        const deletedProject= await this.projectRepository.deleteProjectById(id)

        if (deletedProject === null) {
            throw new NotFoundException("Projeto não está no banco")
        }

        return deletedProject
    }
}