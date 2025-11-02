import { Group } from "app/shared/domain/entities/group";
import { COURSE } from "app/shared/domain/enums/course";
import { IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";
import { IProjectRepository } from "app/shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";
import { BadRequestException } from "app/shared/helpers/exceptions";
import { GroupOficialModel } from "../get_group/get_group_usecase";

interface CreateGroupDTO {
    codSubj: string,
    userIdList: string[]
    yearSem: number,
    projectId: string,
    course: COURSE
}

export class CreateGroupUseCase {
    constructor(
        private readonly groupRepository: IGroupRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly PartnerRepository: IPartnerRepository
    ) {}

    async execute({ codSubj, userIdList, yearSem, projectId, course }: CreateGroupDTO): Promise<GroupOficialModel> {
        const existingProject = await this.projectRepository.getProjectById(projectId)

        if (!existingProject)
            throw new BadRequestException("Projeto selecionado não está no banco");

        const partner= await this.PartnerRepository.getPartnerById(existingProject.partnerId)

        const partnerName= partner!.name

        const userNameList: string[] = []

        for (const userId of userIdList) {
            const existingUser = await this.userRepository.getUserById(userId);

            if (!existingUser)
                throw new BadRequestException("Algum usuário selecionado não está no banco");

            userNameList.push(existingUser.name);
        }

        const groupId = crypto.randomUUID();

        const newGroup = new Group(groupId, codSubj, userIdList, yearSem, projectId, course);

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
            course: newGroup.course
        }
    }
}