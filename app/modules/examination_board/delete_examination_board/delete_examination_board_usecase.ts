import { ExaminationBoard } from "../../../shared/domain/entities/examination_board";
import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeleteExaminationBoardUseCase {
    constructor(private readonly examinationBoardRepository: IExaminationBoardRepository) {}

    async execute(id: string): Promise<ExaminationBoard>{
        const deletedExaminationBoard= await this.examinationBoardRepository.deleteExaminationBoard(id);

        if(deletedExaminationBoard === null){
            throw new NotFoundException("Banca avaliadora não esta no banco");
        }

        return deletedExaminationBoard;
    }
}