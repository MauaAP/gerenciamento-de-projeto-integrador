import { ExaminationBoard } from "../entities/examination_board";

export interface IExaminationBoardRepository {
    createExaminationBoard(examinationBoard: ExaminationBoard): Promise<ExaminationBoard>

    fetchExaminationBoard(): Promise<ExaminationBoard[]>

    getExaminationBoardById(examinationBoardId: string): Promise<ExaminationBoard | null>

    getExaminationBoardByProfessorId(professorId: string): Promise<ExaminationBoard[] | null>

    // metodo que eu adicionei a baixo
    getExaminationBoardByProfessorsId(professorIdList: string[]): Promise<ExaminationBoard | null>

    deleteExaminationBoard(examinationBoardId: string): Promise<ExaminationBoard | null>

    updateExaminationBoard(examinationBoardId: string, professorIdList: string[]): Promise<ExaminationBoard | null>
}