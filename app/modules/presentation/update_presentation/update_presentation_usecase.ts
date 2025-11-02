import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository"
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository"
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository"
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository"
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository"
import { NotFoundException } from "../../../shared/helpers/exceptions"
import { PresentationOficialModel } from "../get_presentation/get_presentation_usecase"
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository"

interface UpdatePresentationInputInterface {
    id: string,
    updateOptions: {
        date?: number,
        groupId?: string,
        examinationBoartId? : string,
        sala?: string
    }
}

export class UpdatePresentationUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository
    ) {}

    async execute({id, updateOptions}: UpdatePresentationInputInterface): Promise<PresentationOficialModel>{

        if(updateOptions?.groupId){
            const group= await this.groupRepository.getGroupById(updateOptions.groupId);

            if (!group){
                throw new NotFoundException("Grupo não está no banco");
            }
        }

        if(updateOptions?.examinationBoartId){
            const examinationBoard= await this.examinationBoardRepository.getExaminationBoardById(updateOptions.examinationBoartId);

            if (!examinationBoard){
                throw new NotFoundException("Banca avaliadora não está no banco");
            }
        }

        const updatedPresentation= await this.presentationRepository.updatePresentation(id, updateOptions)

        if (updatedPresentation == null)
            throw new NotFoundException("Apresentação não está no banco");

        const group= await this.groupRepository.getGroupById(updatedPresentation.groupId);

        // taking group user names
        const userNameList: string[] = []
        for (const userId of group!.userIdList) {
            const existingUser = await this.userRepository.getUserById(userId);

            userNameList.push(existingUser!.name);
        }

        //taking group projectTitle
        const project= await this.projectRepository.getProjectById(group!.projectId);

        const partner= await this.partnerRepository.getPartnerById(project!.partnerId)

        // taking examination board
        const examinationBoard = await this.examinationBoardRepository.getExaminationBoardById(updatedPresentation.examinationBoartId);

        const professorNameList: string[] = []
        for (const professorId of examinationBoard!.professorIdList) {
            const existingProfessor = await this.userRepository.getUserById(professorId);

            professorNameList.push(existingProfessor!.name);
        }

        return {
            id: updatedPresentation.presentationId,
            date: updatedPresentation.date,
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

    }
}