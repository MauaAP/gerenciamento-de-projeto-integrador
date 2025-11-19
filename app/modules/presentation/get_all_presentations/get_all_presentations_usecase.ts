import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { PresentationOficialModel } from "../get_presentation/get_presentation_usecase";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository";

export class GetAllPresentationsUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository,
        private readonly classroomRepository: IClassroomRepository
    ) {}

    async execute(): Promise<PresentationOficialModel[]>{
        const presentationList= await this.presentationRepository.fetchPresentation()

        const presentationOficialModel = await Promise.all(
            presentationList.map(async (presentation) => {
                
                const group= await this.groupRepository.getGroupById(presentation.groupId);

                if (!group) {
                    throw new NotFoundException(`Grupo com ID ${presentation.groupId} não encontrado`);
                }

                // taking group user names
                const userNameList: string[] = []
                for (const userId of group.userIdList) {
                    const user= await this.userRepository.getUserById(userId);

                    if (user) {
                        userNameList.push(user.name);
                    }
                }

                // taking group project title
                const project= await this.projectRepository.getProjectById(group.projectId);

                if (!project) {
                    throw new NotFoundException(`Projeto com ID ${group.projectId} não encontrado`);
                }

               const partner= await this.partnerRepository.getPartnerById(project.partnerId)

                if (!partner) {
                    throw new NotFoundException(`Parceiro com ID ${project.partnerId} não encontrado`);
                }

                // Validar que examinationBoardId existe antes de buscar
                if (!presentation.examinationBoardId) {
                    throw new NotFoundException("Apresentação não possui banca avaliadora associada");
                }

                const examinationBoard= await this.examinationBoardRepository.getExaminationBoardById(presentation.examinationBoardId);

                if (!examinationBoard) {
                    throw new NotFoundException(`Banca avaliadora com ID ${presentation.examinationBoardId} não encontrada`);
                }

                // taking examinationBoard user names
                const professorNameList: string[] = []
                for (const professorId of examinationBoard.professorIdList) {
                    const existingProfessor = await this.userRepository.getUserById(professorId);

                    if (existingProfessor) {
                        professorNameList.push(existingProfessor.name);
                    }
                }

                // here return the schema
                return {
                    id: presentation.presentationId,
                    date: presentation.date,
                    classroomName: presentation.classroomId ? (await this.classroomRepository.getClassroomById(presentation.classroomId))?.name : undefined,
                    status: presentation.status,
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
                        professorNameList: professorNameList
                    }
                }
            })
        );
        return presentationOficialModel
    }
}