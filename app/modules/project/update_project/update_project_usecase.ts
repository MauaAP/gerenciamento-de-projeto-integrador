import { Project } from "app/shared/domain/entities/project";
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";
import { IProjectRepository, ProjectUpdateOptions } from "app/shared/domain/interfaces/IProjectRepository";
import { BadRequestException, NotFoundException } from "app/shared/helpers/exceptions";

interface UpdateProjectDTO {
    id: string,
    updateOptions: {
        title?: string,
        partnerId?: string,
        extensionHours?: number //seconds
    }
}

export class UpdateProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository, private readonly partnerRepository: IPartnerRepository) {}

    async execute({id, updateOptions}: UpdateProjectDTO): Promise<{updatedProject:Project, partnerName: string}> {

        if (updateOptions.partnerId){
            const existingPartner= await this.partnerRepository.getPartnerById(updateOptions.partnerId)
            
            if (!existingPartner) {
                throw new BadRequestException("O parceiro selecionado não está no banco")
            }
        }

        const updatedProject= await this.projectRepository.updateProject(id, updateOptions)

        if (updatedProject === null){
            throw new NotFoundException("Projeto não está no banco")
        }

        const partnerName= (await this.partnerRepository.getPartnerById(updatedProject.partnerId))!.name

        return {updatedProject, partnerName}
    }


}