import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { GroupOficialModel } from "../get_group/get_group_usecase";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";

export class GetAllGroupsUseCase {
    constructor(
        private readonly groupRepository: IGroupRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository,
        private readonly courseRepository: ICourseRepository
    ) {}

    async execute(): Promise<GroupOficialModel[]>{
        const groupList= await this.groupRepository.fetchGroup()

        const groupOficialModel = await Promise.all(
            groupList.map(async (group) =>{
                const course= await this.courseRepository.getCourseById(group.courseId);

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
                    courseName: course!.name
                }
            })
        );
        return groupOficialModel
    }
}