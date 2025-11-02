import { IExaminationBoardRepository } from "app/shared/domain/interfaces/IExaminationBoardRepository"
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository"
import { BadRequestException, NotFoundException } from "app/shared/helpers/exceptions"


interface GetExaminationsBoardDTO {
    id?: string,
    professorId?: string
}

export interface ExaminationBoardOficialModel{
    id: string,
    professorNameList: string[]
}

export class GetExaminationBoardUseCase {
    constructor(
       private readonly examinationBoardRepository: IExaminationBoardRepository,
       private readonly userRepository: IUserRepository
    ) {}

    async execute({id, professorId}: GetExaminationsBoardDTO): Promise<ExaminationBoardOficialModel[]>{
        const selectedExaminationBoard= id
        ? await this.examinationBoardRepository.getExaminationBoardById(id)
        : await this.examinationBoardRepository.getExaminationBoardByProfessorId(professorId!)

        if (selectedExaminationBoard == null) {
            throw new NotFoundException("Nenhuma Banca avaliadora encontrada")
        }

        const examinationBoard= Array.isArray(selectedExaminationBoard) ? selectedExaminationBoard : [selectedExaminationBoard]

        const ExaminationBoardOficialModel= await Promise.all(
            examinationBoard.map(async (examinationBoard) => {
                const professorNameList: string[] = []
                
                for (const professorId of examinationBoard.professorIdList){
                    const existingProfessor= await this.userRepository.getUserById(professorId);
                    
                    // acredit que aqui nao precise pois o professorId vem do banco
                    // if (!existingProfessor)
                    //     throw new BadRequestException("Algum professor selecionado não está no banco");
        
                    professorNameList.push(existingProfessor!.name);
                }

                return {
                    id: examinationBoard.examinationBoardId,
                    professorNameList: professorNameList
                }
            })
        );

        return ExaminationBoardOficialModel;
    }
}