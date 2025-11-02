import { Group } from "app/shared/domain/entities/group";
import { COURSE } from "app/shared/domain/enums/course";
import { IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { IProjectRepository } from "app/shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";
import { BadRequestException } from "app/shared/helpers/exceptions";

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
        private readonly projectRepository: IProjectRepository
    ) {}

    async execute({ codSubj, userIdList, yearSem, projectId, course }: CreateGroupDTO): Promise<{ newGroup: Group, userNameList: string[], projectTitle: string }> {
        const existingProject = await this.projectRepository.getProjectById(projectId)

        if (!existingProject)
            throw new BadRequestException("Projeto selecionado não está no banco");

        const projectTitle = existingProject.title

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

        return { newGroup, userNameList, projectTitle }
    }
}