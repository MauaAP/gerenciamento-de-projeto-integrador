import { Project } from "../../../shared/domain/entities/project";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";
interface CreateProjectDTO{
    title: string,
    partnerId: string,
    extensionHours?: number
}

export class CreateProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository, private readonly partnerRepository: IPartnerRepository) {}

    async execute({title, partnerId, extensionHours}: CreateProjectDTO): Promise<{newProject: Project, partnerName: string}> {
        const existingPartner= await this.partnerRepository.getPartnerById(partnerId)

        if (!existingPartner) {
            throw new BadRequestException("O parceiro selecionado não está no banco")
        }

        const projectId= crypto.randomUUID();

        const newProject = new Project(projectId, title, partnerId, extensionHours)

        await this.projectRepository.createProject(newProject)

        const partnerName= existingPartner.name

        return {newProject, partnerName}
    }
}