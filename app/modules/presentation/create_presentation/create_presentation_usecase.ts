import { Presentation } from "../../../shared/domain/entities/presentation"
import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository"
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository"
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository"
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository"
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository"
import { PresentationOficialModel } from "../get_presentation/get_presentation_usecase"
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository"
import { NotFoundException } from "../../../shared/helpers/exceptions"
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository"
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository"

interface CreatePresentationInputInterface {
    date: number,
    groupId: string,
    examinationBoardId: string,
    classRoomId: string
}

export class CreatePresentationUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository,
        private readonly classroomRepository: IClassroomRepository,
        private readonly courseRepository: ICourseRepository
    ) { }

    async execute({ date, groupId, examinationBoardId, classRoomId }: CreatePresentationInputInterface): Promise<PresentationOficialModel> {
        //taking classroom
        const classRoom = await this.classroomRepository.getClassroomById(classRoomId);

        if (!classRoom)
            throw new NotFoundException("Sala de aula não está no banco");

        // taking group
        const existingGroup = await this.groupRepository.getGroupById(groupId);

        if (!existingGroup)
            throw new NotFoundException("Grupo não está no banco");

        //taking course
        const course = await this.courseRepository.getCourseById(existingGroup.courseId);

        // taking group user names
        const userNameList: string[] = []
        for (const userId of existingGroup.userIdList) {
            const existingUser = await this.userRepository.getUserById(userId);

            userNameList.push(existingUser!.name);
        }

        //taking group projectTitle
        const project = await this.projectRepository.getProjectById(existingGroup.projectId);

        const partner = await this.partnerRepository.getPartnerById(project!.partnerId)

        // taking examination board
        const existingExaminationBoard = await this.examinationBoardRepository.getExaminationBoardById(examinationBoardId);

        if (!existingExaminationBoard)
            throw new NotFoundException("Banca avaliadora selecionada não está no banco");

        // taking examinationBoard user names
        const professorNameList: string[] = []
        for (const professorId of existingExaminationBoard.professorIdList) {
            const existingProfessor = await this.userRepository.getUserById(professorId);

            professorNameList.push(existingProfessor!.name);
        }

        const presentationId = crypto.randomUUID();

        const newPresentation = new Presentation(presentationId, date, groupId, examinationBoardId, classRoom.classroomId);

        // Passar professorIds e alunoIds para criar relacionamentos com GSI
        const professorIds = existingExaminationBoard.professorIdList;
        const alunoIds = existingGroup.userIdList;

        // Type assertion para passar parâmetros opcionais
        await (this.presentationRepository.createPresentation as any)(
            newPresentation,
            professorIds,
            alunoIds
        );

        return {
            id: newPresentation.presentationId,
            date: newPresentation.date,
            classRoomName: classRoom.name,
            group: {
                codSubj: existingGroup.codSubj,
                userNameList: userNameList,
                yearSem: existingGroup.yearSem,
                project: {
                    title: project!.title,
                    partnerName: partner!.name,
                    extensionHours: project!.extensionHours
                },
                courseName: course!.name
            },
            examinationBoard: {
                porfessorNameList: professorNameList
            }
        }
    }
}