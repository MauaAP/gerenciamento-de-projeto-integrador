import { GroupUpdateOptions, IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { GroupOficialModel } from "../get_group/get_group_usecase";
import { BadRequestException, NotFoundException } from "../../../shared/helpers/exceptions";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { ICourseRepository } from "app/shared/domain/interfaces/ICourseRepository";

interface UpdateGroupDTO {
    id: string,
    updateOptions: GroupUpdateOptions
}

export class UpdateGroupUseCase {
    constructor(
            private readonly groupRepository: IGroupRepository,
            private readonly userRepository: IUserRepository,
            private readonly projectRepository: IProjectRepository,
            private readonly partnerRepository: IPartnerRepository,
            private readonly courseRepository: ICourseRepository
    ) {}

    async execute({id, updateOptions}: UpdateGroupDTO): Promise<GroupOficialModel>{
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

        if(updateOptions?.courseId) {
            const course= await this.courseRepository.getCourseById(updateOptions.courseId);

            if (!course){
                throw new BadRequestException("O curso selecionado não está no banco");
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

        const course= await this.courseRepository.getCourseById(updatedGroup.courseId)

        const project= (await this.projectRepository.getProjectById(updatedGroup.projectId))

        const partner= await this.partnerRepository.getPartnerById(project!.partnerId)

        const partnerName= partner!.name 

        return {
            id: updatedGroup.groupId,
            codSubj: updatedGroup.codSubj,
            userNameList: userNameList,
            yearSem: updatedGroup.yearSem,
            project: {
                title: project!.title,
                partnerName: partnerName,
                extensionHours: project!.extensionHours
            },
            courseName: course!.name
        }
    }
}