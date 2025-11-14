import { ExaminationBoard } from "../../../shared/domain/entities/examination_board";
import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { BadRequestException, NotFoundException } from "../../../shared/helpers/exceptions";

interface UpdateExaminationBoardDTO {
    id: string,
    newProfessorIdList: string[]
}

export class UpdateExaminationBoardUseCase {
    constructor(
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute({id, newProfessorIdList}: UpdateExaminationBoardDTO): Promise<{updatedExaminationBoard: ExaminationBoard, professorNameList: string[]}>{
        const professorNameList: string[] = []
                        
        for (const professorId of newProfessorIdList){
            const existingProfessor= await this.userRepository.getUserById(professorId);

            if (!existingProfessor)
                throw new BadRequestException("Algum professor selecionado não está no banco");

            if(existingProfessor.role !== "PROFESSOR"){
                throw new BadRequestException("Algum usuário selecionado não é professor");
            }

            professorNameList.push(existingProfessor.name);
        }

        const updatedExaminationBoard= await this.examinationBoardRepository.updateExaminationBoard(id, newProfessorIdList);

        if (updatedExaminationBoard === null)
            throw new NotFoundException("Banca avaliadora selecionada não esta no banco")

        return {updatedExaminationBoard, professorNameList}
    }
}