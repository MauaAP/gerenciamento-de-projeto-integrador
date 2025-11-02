import { IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { IProjectRepository } from "app/shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";
import { GroupOficialModel } from "../get_group/get_group_usecase";
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";

export class GetAllGroupsUseCase {
    constructor(
        private readonly groupRepository: IGroupRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository
    ) {}

    async execute(): Promise<GroupOficialModel[]>{
        const groupList= await this.groupRepository.fetchGroup()

        const groupOficialModel = await Promise.all(
            groupList.map(async (group) =>{
                const project= await this.projectRepository.getProjectById(group.projectId);

                const partner= await this.partnerRepository.getPartnerById(project!.partnerId)

                const userNameList: string[]= []

                for (const userId of group.userIdList){
                    const user= await this.userRepository.getUserById(userId);

                    userNameList.push(user!.name)
                }

                return {
                    id: group.groupId,
                    codSubj: group.codSubj,
                    userNameList: userNameList,
                    yearSem: group.yearSem,
                    project: {
                        title: project!.title,
                        partnerName: partner!.name,
                        extensionHours: project!.extensionHours
                    },
                    course: group.course
                }
            })
        );
        return groupOficialModel
    }
}