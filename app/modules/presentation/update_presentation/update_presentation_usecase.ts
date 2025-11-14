import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository"
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository"
import { IPresentationRepository, PresentationUpdateOptions } from "../../../shared/domain/interfaces/IPresentationRepository"
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository"
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository"
import { NotFoundException } from "../../../shared/helpers/exceptions"
import { PresentationOficialModel } from "../get_presentation/get_presentation_usecase"
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository"
import { PRESENTATION_STATUS } from "../../../shared/domain/enums/presentation_status"
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository"

interface UpdatePresentationInputInterface {
    id: string,
    updateOptions: {
        date?: number,
        groupId?: string,
        examinationBoardId? : string,
        classroomId?: string,
        status?: PRESENTATION_STATUS
    }
}

export class UpdatePresentationUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository,
        private readonly classroomRepository: IClassroomRepository
    ) {}

    async execute({id, updateOptions}: UpdatePresentationInputInterface): Promise<PresentationOficialModel>{

        if(updateOptions?.groupId){
            const group= await this.groupRepository.getGroupById(updateOptions.groupId);

            if (!group){
                throw new NotFoundException("Grupo não está no banco");
            }
        }

        if(updateOptions?.examinationBoardId){
            const examinationBoard= await this.examinationBoardRepository.getExaminationBoardById(updateOptions.examinationBoardId);

            if (!examinationBoard){
                throw new NotFoundException("Banca avaliadora não está no banco");
            }
        }

        const repositoryUpdateOptions: PresentationUpdateOptions = { ...updateOptions };
        if(updateOptions?.classroomId){
            const classroom = await this.classroomRepository.getClassroomById(updateOptions.classroomId);
            if (!classroom){
                throw new NotFoundException("Sala não está no banco");
            }
        }

        const updatedPresentation= await this.presentationRepository.updatePresentation(id, repositoryUpdateOptions)

        if (updatedPresentation == null)
            throw new NotFoundException("Apresentação não está no banco");

        const group= await this.groupRepository.getGroupById(updatedPresentation.groupId);

        if (!group) {
            throw new NotFoundException(`Grupo com ID ${updatedPresentation.groupId} não encontrado`);
        }

        // taking group user names
        const userNameList: string[] = []
        for (const userId of group.userIdList) {
            const existingUser = await this.userRepository.getUserById(userId);

            if (existingUser) {
                userNameList.push(existingUser.name);
            }
        }

        //taking group projectTitle
        const project= await this.projectRepository.getProjectById(group.projectId);

        if (!project) {
            throw new NotFoundException(`Projeto com ID ${group.projectId} não encontrado`);
        }

        const partner= await this.partnerRepository.getPartnerById(project.partnerId)

        if (!partner) {
            throw new NotFoundException(`Parceiro com ID ${project.partnerId} não encontrado`);
        }

        // taking examination board
        const examinationBoard = await this.examinationBoardRepository.getExaminationBoardById(updatedPresentation.examinationBoardId);

        if (!examinationBoard) {
            throw new NotFoundException(`Banca avaliadora com ID ${updatedPresentation.examinationBoardId} não encontrada`);
        }

        const professorNameList: string[] = []
        for (const professorId of examinationBoard.professorIdList) {
            const existingProfessor = await this.userRepository.getUserById(professorId);

            if (existingProfessor) {
                professorNameList.push(existingProfessor.name);
            }
        }

        // Buscar classroom para obter o nome atualizado
        let classroomName: string | undefined = undefined;
        if (updatedPresentation.classroomId) {
            const classroom = await this.classroomRepository.getClassroomById(updatedPresentation.classroomId);
            if (classroom) {
                classroomName = classroom.name;
            }
        }

        return {
            id: updatedPresentation.presentationId,
            date: updatedPresentation.date,
            group: {
                codSubj: group.codSubj,
                userNameList: userNameList,
                yearSem: group.yearSem,
                project: {
                    title: project.title,
                    partnerName: partner.name,
                    extensionHours: project.extensionHours
                },
                course: group.course
            },
            examinationBoard: {
                porfessorNameList: professorNameList
            },
            classroomName: classroomName
        }

    }
}