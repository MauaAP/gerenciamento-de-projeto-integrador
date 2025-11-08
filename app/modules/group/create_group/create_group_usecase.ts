import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";
import { Group } from "../../../shared/domain/entities/group";
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { GroupOficialModel } from "../get_group/get_group_usecase";

interface CreateGroupDTO {
    codSubj: string,
    userIdList: string[]
    yearSem: number,
    projectId: string,
    courseId: string
}

export class CreateGroupUseCase {
    constructor(
        private readonly groupRepository: IGroupRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository,
        private readonly courseRepository: ICourseRepository
    ) {}

    async execute({ codSubj, userIdList, yearSem, projectId, courseId }: CreateGroupDTO): Promise<GroupOficialModel> {
        // getting project
        const existingProject = await this.projectRepository.getProjectById(projectId)

        if (!existingProject)
            throw new BadRequestException("Projeto selecionado não está no banco");

        const partner= await this.partnerRepository.getPartnerById(existingProject.partnerId)

        const partnerName= partner!.name

        // getting course
        const existingCourse= await this.courseRepository.getCourseById(courseId)

        if (!existingCourse)
            throw new BadRequestException("Curso selecionado não está no banco");

        // getting users and their names
        const userNameList: string[] = []

        for (const userId of userIdList) {
            const existingUser = await this.userRepository.getUserById(userId);

            if (!existingUser)
                throw new BadRequestException("Algum usuário selecionado não está no banco");

            userNameList.push(existingUser.name);
        }

        const groupId = crypto.randomUUID();

        const newGroup = new Group(groupId, codSubj, userIdList, yearSem, projectId, courseId);

        await this.groupRepository.createGroup(newGroup)

        return {
            id: newGroup.groupId,
            codSubj: newGroup.codSubj,
            userNameList: userNameList,
            yearSem: newGroup.yearSem,
            project: {
                title: existingProject.title,
                partnerName: partnerName,
                extensionHours: existingProject.extensionHours
            },
            courseName: existingCourse.name
        }
    }
}