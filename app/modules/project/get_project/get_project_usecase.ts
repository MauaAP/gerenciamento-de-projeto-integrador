import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";
import { IProjectRepository } from "app/shared/domain/interfaces/IProjectRepository";
import { NotFoundException } from "app/shared/helpers/exceptions";

interface GetProjectDTO {
    id?: string,
    partnerId?: string
}

export interface ProjectWithPartnerName {
    projectId: string;
    title: string;
    partnerName: string;
    extensionHours?: number;
}

export class GetProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository, private readonly partnerRepository: IPartnerRepository) { }

    async execute({ id, partnerId }: GetProjectDTO): Promise<ProjectWithPartnerName[]> {
        const selectedProject = id
            ? await this.projectRepository.getProjectById(id)
            : await this.projectRepository.getProjectByPartnerId(partnerId!)

        if (selectedProject === null) {
            throw new NotFoundException("Nenhum projeto encontrado");
        }

        const projects = Array.isArray(selectedProject) ? selectedProject : [selectedProject];

        const projectsWithPartnerName = await Promise.all(
            projects.map(async (project) => {
                const partner = await this.partnerRepository.getPartnerById(project.partnerId);

                return {
                    projectId: project.projectId,
                    title: project.title,
                    partnerName: partner!.name,
                    extensionHours: project.extensionHours
                };
            })
        );

        return projectsWithPartnerName;
    }
}