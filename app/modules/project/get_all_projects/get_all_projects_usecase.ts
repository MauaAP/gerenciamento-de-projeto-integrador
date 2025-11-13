import { Project } from "../../../shared/domain/entities/project";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { ProjectWithPartnerName } from "../get_project/get_project_usecase";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class GetAllProjectsUseCase {
    constructor(private readonly projectRepository: IProjectRepository, private readonly partnerRepository: IPartnerRepository) {}

    async execute(): Promise<ProjectWithPartnerName[]> {
        const projects= await this.projectRepository.fetchProjects();

        const projectsWithPartnerName = await Promise.all(
            projects.map(async (project) => {
                const partner = await this.partnerRepository.getPartnerById(project.partnerId);

                if (!partner) {
                    throw new NotFoundException(`Parceiro com ID ${project.partnerId} não encontrado`);
                }

                return {
                    projectId: project.projectId,
                    title: project.title,
                    partnerName: partner.name,
                    extensionHours: project.extensionHours
                };
            })
        );

        return projectsWithPartnerName;
    }
}