import { COURSE } from "../../../shared/domain/enums/course";
import { GroupFilter, IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { BadRequestException, NotFoundException } from "../../../shared/helpers/exceptions";

interface GetGroupDTO {
    id?: string,
    groupFilter?: GroupFilter
}

export interface GroupOficialModel {
    id: string;
    codSubj: string;
    userNameList: string[];
    yearSem: number;
    project: {
        title: string;
        partnerName: string;
        extensionHours?: number;
    }
    course: COURSE;
}

export class GetGroupUseCase {
    constructor(
        private readonly groupRepository: IGroupRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository
    ) {}

    async execute({id, groupFilter}: GetGroupDTO): Promise<GroupOficialModel[]>{
        const selectedGroup = id
        ? await this.groupRepository.getGroupById(id)
        : await this.groupRepository.getGroupByFilter(groupFilter!)

        if (selectedGroup == null) {
            throw new NotFoundException("Nenhum grupo encontrado");
        }

        const groups = Array.isArray(selectedGroup) ? selectedGroup : [selectedGroup];

        const groupOficialModel = await Promise.all(
            groups.map(async (group) => {
                
                // aqui pego o projeto
                const project= await this.projectRepository.getProjectById(group.projectId);

                if (!project) {
                    throw new NotFoundException(`Projeto com ID ${group.projectId} não encontrado`);
                }

                // aqui pego o parceiro
                const partner= await this.partnerRepository.getPartnerById(project.partnerId);

                if (!partner) {
                    throw new NotFoundException(`Parceiro com ID ${project.partnerId} não encontrado`);
                }

                // aqui seleciono o nome dos usuarios e atribuo a uma nova lista
                const userNameList: string[] = []

                for (const userId of group.userIdList){
                    const existingUser= await this.userRepository.getUserById(userId);
        
                    if (!existingUser)
                        throw new BadRequestException("Algum usuário selecionado não está no banco");
        
                    userNameList.push(existingUser.name);
                }

                // aqui retorno o esquema que desejo
                return {
                    id: group.groupId,
                    codSubj: group.codSubj,
                    userNameList: userNameList,
                    yearSem: group.yearSem,
                    project: {
                        title: project.title,
                        partnerName: partner.name,
                        extensionHours: project.extensionHours
                    },
                    course: group.course
                };
            })
        );

        return groupOficialModel
    }
}