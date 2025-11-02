import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { PresentationOficialModel } from "../get_presentation/get_presentation_usecase";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";

export class GetAllPresentationsUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository
    ) {}

    async execute(): Promise<PresentationOficialModel[]>{
        const presentationList= await this.presentationRepository.fetchPresentation()

        const presentationOficialModel = await Promise.all(
            presentationList.map(async (presentation) => {
                
                const group= await this.groupRepository.getGroupById(presentation.groupId);

                // taking group user names
                const userNameList: string[] = []
                for (const userId of group!.userIdList) {
                    const user= await this.userRepository.getUserById(userId);

                    userNameList.push(user!.name)
                }

                // taking group project title
                const project= await this.projectRepository.getProjectById(group!.projectId);

               const partner= await this.partnerRepository.getPartnerById(project!.partnerId)

                const examinationBoard= await this.examinationBoardRepository.getExaminationBoardById(presentation.examinationBoartId);

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