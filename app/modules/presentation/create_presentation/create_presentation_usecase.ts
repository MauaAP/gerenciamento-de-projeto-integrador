import { ExaminationBoard } from "../../../shared/domain/entities/examination_board"
import { Group } from "../../../shared/domain/entities/group"
import { Presentation } from "../../../shared/domain/entities/presentation"
import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository"
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository"
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository"
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository"
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository"
import { BadRequestException, NotFoundException } from "../../../shared/helpers/exceptions"
import { PresentationOficialModel } from "../get_presentation/get_presentation_usecase"
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository"
import { PRESENTATION_STATUS } from "../../../shared/domain/enums/presentation_status"
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository"

interface CreatePresentationInputInterface {
    date: number,
    groupId: string,
    examinationBoardId: string,
    classroomId: string,
    status?: PRESENTATION_STATUS
}

export class CreatePresentationUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository,
        private readonly classroomRepository: IClassroomRepository
    ) {}

     async execute({date, groupId, examinationBoardId, classroomId, status}: CreatePresentationInputInterface): Promise<PresentationOficialModel> {
        const existingGroup = await this.groupRepository.getGroupById(groupId);

        if (!existingGroup)
            throw new NotFoundException("Grupo não está no banco");

        // Validar classroomId
        const existingClassroom = await this.classroomRepository.getClassroomById(classroomId);
        if (!existingClassroom)
            throw new NotFoundException("Sala não está no banco");

        const userNameList: string[] = []
        for (const userId of existingGroup.userIdList) {
            const existingUser = await this.userRepository.getUserById(userId);

            if (existingUser) {
                userNameList.push(existingUser.name);
            }
        }

        const project= await this.projectRepository.getProjectById(existingGroup.projectId);

        if (!project) {
            throw new NotFoundException(`Projeto com ID ${existingGroup.projectId} não encontrado`);
        }

        const partner= await this.partnerRepository.getPartnerById(project.partnerId)

        if (!partner) {
            throw new NotFoundException(`Parceiro com ID ${project.partnerId} não encontrado`);
        }

        const existingExaminationBoard = await this.examinationBoardRepository.getExaminationBoardById(examinationBoardId);

        if (!existingExaminationBoard)
            throw new NotFoundException("Banca avaliadora selecionada não está no banco");

        const professorNameList: string[] = []
        for (const professorId of existingExaminationBoard.professorIdList) {
            const existingProfessor = await this.userRepository.getUserById(professorId);

            if (existingProfessor) {
                professorNameList.push(existingProfessor.name);
            }
        }

        const presentationId = crypto.randomUUID();

        const presentationStatus = status || PRESENTATION_STATUS.SCHEDULED;
        const newPresentation = new Presentation(presentationId, date, groupId, examinationBoardId, classroomId, presentationStatus);

        const professorIds = existingExaminationBoard.professorIdList;
        const alunoIds = existingGroup.userIdList;
        
        await (this.presentationRepository.createPresentation as any)(
            newPresentation, 
            professorIds, 
            alunoIds
        );

        return {
            id: newPresentation.presentationId,
            date: newPresentation.date,
            classroomName: existingClassroom.name,
            status: newPresentation.status,
            group: {
                codSubj: existingGroup.codSubj,
                userNameList: userNameList,
                yearSem: existingGroup.yearSem,
                project: {
                    title: project.title,
                    partnerName: partner.name,
                    extensionHours: project.extensionHours
                },
                course: existingGroup.course
            },
            examinationBoard: {
                professorNameList: professorNameList
            },
        }
    }
}