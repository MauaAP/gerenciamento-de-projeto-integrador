import { COURSE } from "app/shared/domain/enums/course";
import { IExaminationBoardRepository } from "app/shared/domain/interfaces/IExaminationBoardRepository";
import { IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";
import { IPresentationRepository } from "app/shared/domain/interfaces/IPresentationRepository";
import { IProjectRepository } from "app/shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";
import { NotFoundException } from "app/shared/helpers/exceptions";

interface GetPresentationInputInterface {
    id?: string,
    presentationFilter?: {
        date?: number,
        groupId?: string,
        examinationBoartId?: string
    }
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

    async execute({id, presentationFilter}: GetPresentationInputInterface): Promise<PresentationOficialModel[]>{
        const selectedPresentation = id
        ? await this.presentationRepository.getPresentationById(id)
        : await this.presentationRepository.getPresentationByFilter(presentationFilter!)

        if (selectedPresentation == null)
            throw new NotFoundException("Nenhuma apresentação encontrada");

        const presentations = Array.isArray(selectedPresentation) ? selectedPresentation : [selectedPresentation];

        const presentationOficialModel = await Promise.all(
            presentations.map(async (presentation) => {
                
                // aqui pego o grupo
                const group= await this.groupRepository.getGroupById(presentation.groupId);

                // taking group user names
                const userNameList: string[] = []
                for (const userId of group!.userIdList) {
                    const existingUser = await this.userRepository.getUserById(userId);

                    userNameList.push(existingUser!.name);
                }

                //taking group projectTitle
                const project= await this.projectRepository.getProjectById(group!.projectId);

                const partner= await this.partnerRepository.getPartnerById(project!.partnerId)

                const examinationBoard = await this.examinationBoardRepository.getExaminationBoardById(presentation.examinationBoartId);

                // taking examinationBoard user names
                const professorNameList: string[] = []
                for (const professorId of examinationBoard!.professorIdList) {
                    const existingProfessor = await this.userRepository.getUserById(professorId);

                    professorNameList.push(existingProfessor!.name);
                }

                // here return the schema
                return {
                    id: presentation.presentationId,
                    date: presentation.date,
                    group: {
                        codSubj: group!.codSubj,
                        userNameList: userNameList,
                        yearSem: group!.yearSem,
                        project: {
                            title: project!.title,
                            partnerName: partner!.name,
                            extensionHours: project!.extensionHours
                        },
                        course: group!.course
                    },
                    examinationBoard: {
                        porfessorNameList: professorNameList
                    }
                }
            })
        );

        return presentationOficialModel
    }
}