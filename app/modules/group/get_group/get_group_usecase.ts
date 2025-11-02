import { COURSE } from "app/shared/domain/enums/course";
import { GroupFilter, IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { IProjectRepository } from "app/shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";
import { BadRequestException, NotFoundException } from "app/shared/helpers/exceptions";

interface GetGroupDTO {
    id?: string,
    groupFilter?: GroupFilter
}

export interface GroupOficialModel {
    id: string;
    codSubj: string;
    userNameList: string[];
    yearSem: number;
    projectTitle: string;
    course: COURSE;
}

export class GetGroupUseCase {
    constructor(
        private readonly groupRepository: IGroupRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository
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
                    projectTitle: project!.title,
                    course: group.course
                };
            })
        );

        return groupOficialModel
    }
}