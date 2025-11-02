import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { ExaminationBoardOficialModel } from "../get_examination_board/get_examination_board_usecase";

export class GetAllExaminationBoardsUseCase{
    constructor(
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(): Promise<ExaminationBoardOficialModel[]>{
        const examinationBoardsList= await this.examinationBoardRepository.fetchExaminationBoard()

        const examinationBoardOficialModel= await Promise.all(
            examinationBoardsList.map(async (examinationBoard) =>{
                const professorNameList: string[] = []
                                
                for (const professorId of examinationBoard.professorIdList){
                    const existingProfessor= await this.userRepository.getUserById(professorId);
        
                    professorNameList.push(existingProfessor!.name);
                }

                return {
                    id: examinationBoard.examinationBoardId,
                    professorNameList: professorNameList
                }
                
            })
        );
        return examinationBoardOficialModel;
    }
}
