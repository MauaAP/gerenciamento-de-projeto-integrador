import { COURSE } from "../../../shared/domain/enums/course";
import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";
import { PRESENTATION_STATUS } from "../../../shared/domain/enums/presentation_status";
import { Presentation } from "../../../shared/domain/entities/presentation";

interface GetPresentationInputInterface {
    id?: string,
    presentationFilter?: {
        date?: number,
        groupId?: string,
        examinationBoardId?: string,
        status?: PRESENTATION_STATUS
    },
    userId?: string,
    userRole?: string
}

export interface PresentationOficialModel {
    id: string;
    date: number;
    group: {
        codSubj: string;
        userNameList: string[];
        yearSem: number;
        project: {
            title: string;
            partnerName: string;
            extensionHours?: number;
        }
        course: COURSE;
    };
    examinationBoard: {
        porfessorNameList: string[];
    };
    classroomName?: string;
}

export class GetPresentationUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository
    ) {}

    async execute({id, presentationFilter, userId, userRole}: GetPresentationInputInterface): Promise<PresentationOficialModel[]>{
        let selectedPresentation: Presentation[] | Presentation | null = null;

        // Se status foi passado e userId/userRole estão disponíveis, usar métodos específicos por role
        if (presentationFilter?.status && userId && userRole) {
            if (userRole === "STUDENT") {
                selectedPresentation = await this.presentationRepository.getPresentationByStudentId(userId, presentationFilter.status);
            } else if (userRole === "MODERATOR" || userRole === "ADMIN") {
                selectedPresentation = await this.presentationRepository.getPresentationByExaminatorId(userId, presentationFilter.status);
            } else {
                // Para PROFESSOR, também usar getPresentationByExaminatorId
                selectedPresentation = await this.presentationRepository.getPresentationByExaminatorId(userId, presentationFilter.status);
            }
        } else if (id) {
            // Buscar por ID específico
            selectedPresentation = await this.presentationRepository.getPresentationById(id);
        } else if (presentationFilter) {
            // Usar filtros normais
            selectedPresentation = await this.presentationRepository.getPresentationByFilter(presentationFilter);
        } else {
            throw new NotFoundException("Nenhuma apresentação encontrada");
        }

        if (selectedPresentation == null)
            throw new NotFoundException("Nenhuma apresentação encontrada");

        const presentations = Array.isArray(selectedPresentation) ? selectedPresentation : [selectedPresentation];

        const presentationOficialModel = await Promise.all(
            presentations.map(async (presentation) => {
                
                // aqui pego o grupo
                const group= await this.groupRepository.getGroupById(presentation.groupId);

                if (!group) {
                    throw new NotFoundException(`Grupo com ID ${presentation.groupId} não encontrado`);
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

                // Validar que examinationBoardId existe antes de buscar
                if (!presentation.examinationBoardId) {
                    throw new NotFoundException("Apresentação não possui banca avaliadora associada");
                }

                const examinationBoard = await this.examinationBoardRepository.getExaminationBoardById(presentation.examinationBoardId);

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
                    classroomName: presentation.sala || undefined
                }
            })
        );

        return presentationOficialModel
    }
}