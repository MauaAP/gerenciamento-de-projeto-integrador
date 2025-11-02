import { ExaminationBoard } from "../../../shared/domain/entities/examination_board";
import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";

interface CreateExaminationBoardDTO {
    professorIdList: string[]
}

export class CreateExaminationBoardUseCase {
    constructor(
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute({professorIdList}: CreateExaminationBoardDTO): Promise<{newExaminationBoard: ExaminationBoard, professorNameList: string[]}>{
        const professorNameList: string[] = []
        
        for (const professorId of professorIdList) {
            const existingProfessor = await this.userRepository.getUserById(professorId);

            if (!existingProfessor)
                throw new BadRequestException("Algum usuário selecionado não está no banco");

            if(existingProfessor.role !== "PROFESSOR"){
                throw new BadRequestException("Algum usuário selecionado não é professor");
            }

            professorNameList.push(existingProfessor.name);
        }

        const examinationBoardId = crypto.randomUUID();
        
        const newExaminationBoard= new ExaminationBoard(examinationBoardId, professorIdList)

        await this.examinationBoardRepository.createExaminationBoard(newExaminationBoard)

        return {newExaminationBoard, professorNameList}
    }
}