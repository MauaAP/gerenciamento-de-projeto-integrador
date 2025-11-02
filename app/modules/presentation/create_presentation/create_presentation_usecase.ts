import { ExaminationBoard } from "app/shared/domain/entities/examination_board"
import { Group } from "app/shared/domain/entities/group"
import { Presentation } from "app/shared/domain/entities/presentation"
import { IExaminationBoardRepository } from "app/shared/domain/interfaces/IExaminationBoardRepository"
import { IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository"
import { IPresentationRepository } from "app/shared/domain/interfaces/IPresentationRepository"
import { IProjectRepository } from "app/shared/domain/interfaces/IProjectRepository"
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository"
import { BadRequestException, NotFoundException } from "app/shared/helpers/exceptions"
import { PresentationOficialModel } from "../get_presentation/get_presentation_usecase"
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository"

interface CreatePresentationInputInterface {
    date: number,
    groupId: string,
    examinationBoartId: string
}

export class CreatePresentationUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository
    ) {}

    async execute({date, groupId, examinationBoartId}: CreatePresentationInputInterface): Promise<PresentationOficialModel> {
        // taking group
        const existingGroup = await this.groupRepository.getGroupById(groupId);

        if (!existingGroup)
            throw new NotFoundException("Grupo não está no banco");


        // taking group user names
        const userNameList: string[] = []
        for (const userId of existingGroup.userIdList) {
            const existingUser = await this.userRepository.getUserById(userId);

            userNameList.push(existingUser!.name);
        }

        //taking group projectTitle
        const project= await this.projectRepository.getProjectById(existingGroup.projectId);

        const partner= await this.partnerRepository.getPartnerById(project!.partnerId)

        // taking examination board
        const existingExaminationBoard = await this.examinationBoardRepository.getExaminationBoardById(examinationBoartId);

        if (!existingExaminationBoard)
            throw new NotFoundException("Banca avaliadora selecionada não está no banco");

        // taking examinationBoard user names
        const professorNameList: string[] = []
        for (const professorId of existingExaminationBoard.professorIdList) {
            const existingProfessor = await this.userRepository.getUserById(professorId);

            professorNameList.push(existingProfessor!.name);
        }

        const presentationId = crypto.randomUUID();

        const newPresentation = new Presentation(presentationId, date, groupId, examinationBoartId);

        await this.presentationRepository.createPresentation(newPresentation);

        return {
            id: newPresentation.presentationId,
            date: newPresentation.date,
            group: {
                codSubj: existingGroup.codSubj,
                userNameList: userNameList,
                yearSem: existingGroup.yearSem,
                project: {
                    title: project!.title,
                    partnerName: partner!.name,
                    extensionHours: project!.extensionHours
                },
                course: existingGroup.course
            },
            examinationBoard: {
                porfessorNameList: professorNameList
            }
        }
    }
}