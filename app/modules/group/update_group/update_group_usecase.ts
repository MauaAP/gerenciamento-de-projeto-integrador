import { GroupUpdateOptions, IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { IProjectRepository } from "app/shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";
import { GroupOficialModel } from "../get_group/get_group_usecase";
import { BadRequestException, NotFoundException } from "app/shared/helpers/exceptions";
import { Group } from "app/shared/domain/entities/group";

interface UpdateGroupDTO {
    id: string,
    updateOptions: GroupUpdateOptions
}

export class UpdateGroupUseCase {
    constructor(
            private readonly groupRepository: IGroupRepository,
            private readonly userRepository: IUserRepository,
            private readonly projectRepository: IProjectRepository
    ) {}

    async execute({id, updateOptions}: UpdateGroupDTO): Promise<{updatedGroup: Group, userNameList: string[], projectTitle: string}>{
        if(updateOptions?.userIdList){
            for (const userId of updateOptions.userIdList){
                const existingUser= await this.userRepository.getUserById(userId);
    
                if (!existingUser)
                    throw new BadRequestException("Algum usuário selecionado não está no banco");
    
            }
        }

        if(updateOptions?.projectId) {
            const project= await this.projectRepository.getProjectById(updateOptions.projectId);

            if (!project){
                throw new BadRequestException("O projeto selecionado não está no banco");
            }
        }
        
        const updatedGroup= await this.groupRepository.updateGroup(id, updateOptions)

        if(updatedGroup === null)
            throw new NotFoundException("Grupo não está no banco")

        const userNameList: string[] = []

        for (const userId of updatedGroup.userIdList){
            const user= await this.userRepository.getUserById(userId);

            userNameList.push(user!.name);
        }

        const projectTitle= (await this.projectRepository.getProjectById(updatedGroup.projectId))!.title

        return {updatedGroup, userNameList, projectTitle}
    }
}