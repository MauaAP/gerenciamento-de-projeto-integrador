import { ExaminationBoard } from "app/shared/domain/entities/examination_board";
import { IExaminationBoardRepository } from "app/shared/domain/interfaces/IExaminationBoardRepository";

export class ExaminationBoardRepositoryMock implements IExaminationBoardRepository {
    private examinationBoards: ExaminationBoard [] = [
        new ExaminationBoard(
            "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b",
            ["a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3", "c3d2e4f4-8b1a-47c2-88ff-d3e6d683b5e5", "d4e3f5g5-7h8i-49j0-99gg-h1i2j3k4l5m6"]
        ),
        new ExaminationBoard(
            "3896e005-bc5c-4839-a43b-463ae9c3583c",
            ["a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3", "d4e3f5g5-7h8i-49j0-99gg-h1i2j3k4l5m6"]
        ),
        new ExaminationBoard(
            "bf344b2b-b79a-45dc-99e8-798df38f03fe",
            ["d4e3f5g5-7h8i-49j0-99gg-h1i2j3k4l5m6", "5157e667-0a2c-45fb-acd3-7a56063db9b1"]
        ),
        new ExaminationBoard(
            "d28a5fcb-22e8-4955-b6cd-b48986e41176",
            ["5157e667-0a2c-45fb-acd3-7a56063db9b1", "895c63c7-fb29-4c5d-8c63-a5302e3946e1"]
        ),
        new ExaminationBoard(
            "a28ed23d-3660-4ed4-b384-b1c12920c8d4",
            ["5157e667-0a2c-45fb-acd3-7a56063db9b1", "895c63c7-fb29-4c5d-8c63-a5302e3946e1"]
        )
    ];

    async createExaminationBoard(examinationBoard: ExaminationBoard): Promise<ExaminationBoard> {
        this.examinationBoards.push(examinationBoard);
        return examinationBoard;
    }

    async fetchExaminationBoard(): Promise<ExaminationBoard[]> {
        return this.examinationBoards;
    }

    async getExaminationBoardById(examinationBoardId: string): Promise<ExaminationBoard | null> {
        return this.examinationBoards.find((examinationBoard) => examinationBoard.examinationBoardId === examinationBoardId) || null;
    }

    async getExaminationBoardByProfessorId(professorId: string): Promise<ExaminationBoard[] | null> {
        const result= this.examinationBoards.filter((examinationBoard) => examinationBoard.professorIdList.includes(professorId));

        return result.length > 0 ? result : null
    }

    async deleteExaminationBoard(examinationBoardId: string): Promise<ExaminationBoard | null> {
        const index= this.examinationBoards.findIndex((examinationBoard) => examinationBoard.examinationBoardId === examinationBoardId);

        if (index === -1) return null;

        return this.examinationBoards.splice(index, 1)[0];
    }

    async updateExaminationBoard(examinationBoardId: string, professorIdList: string[]): Promise<ExaminationBoard | null> {
        const examinationBoard= this.examinationBoards.find((examinationBoard) => examinationBoard.examinationBoardId === examinationBoardId) || null;

        if(examinationBoard === null) {
            return null;
        }

       examinationBoard.professorIdList= professorIdList

        return examinationBoard
    }
}