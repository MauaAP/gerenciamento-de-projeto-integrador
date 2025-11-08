import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository";
import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

interface GetPresentationInputInterface {
    id?: string,
    presentationFilter?: {
        date?: number,
        groupId?: string,
        examinationBoardId?: string
    }
}

export interface PresentationOficialModel {
    id: string;
    date: number;
    classRoomName: string;
    group: {
        codSubj: string;
        userNameList: string[];
        yearSem: number;
        project: {
            title: string;
            partnerName: string;
            extensionHours?: number;
        }
        courseName: string;
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
        private readonly partnerRepository: IPartnerRepository,
        private readonly classroomRepository: IClassroomRepository,
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute({ id, presentationFilter }: GetPresentationInputInterface): Promise<PresentationOficialModel[]> {
        const selectedPresentation = id
            ? await this.presentationRepository.getPresentationById(id)
            : await this.presentationRepository.getPresentationByFilter(presentationFilter!)

        if (selectedPresentation == null)
            throw new NotFoundException("Nenhuma apresentação encontrada");

        const presentations = Array.isArray(selectedPresentation) ? selectedPresentation : [selectedPresentation];

        const presentationOficialModel = await Promise.all(
            presentations.map(async (presentation) => {

                //gettting classroom
                const classRoom =  await this.classroomRepository.getClassroomById(presentation.classRoomId);

                // aqui pego o grupo
                const group = await this.groupRepository.getGroupById(presentation.groupId);

                //taking course
                const course = await this.courseRepository.getCourseById(group!.courseId);

                // taking group user names
                const userNameList: string[] = []
                for (const userId of group!.userIdList) {
                    const existingUser = await this.userRepository.getUserById(userId);

                    userNameList.push(existingUser!.name);
                }

                //taking group projectTitle
                const project = await this.projectRepository.getProjectById(group!.projectId);

                const partner = await this.partnerRepository.getPartnerById(project!.partnerId)

                const examinationBoard = await this.examinationBoardRepository.getExaminationBoardById(presentation.examinationBoardId);

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
                    classRoomName: classRoom!.name,
                    group: {
                        codSubj: group!.codSubj,
                        userNameList: userNameList,
                        yearSem: group!.yearSem,
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
            })
        );

        return presentationOficialModel
    }
}