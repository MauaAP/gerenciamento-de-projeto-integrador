import { IExaminationBoardRepository } from "app/shared/domain/interfaces/IExaminationBoardRepository";
import type { DynamoDBResources } from "./dynamo_datasource";
import { ExaminationBoard } from "app/shared/domain/entities/examination_board";

export class ExaminationBoardRepositoryDynamoDB implements IExaminationBoardRepository {
    private db: DynamoDBResources;

    constructor(db: DynamoDBResources) {
        this.db= db;
    }

    createExaminationBoard(examinationBoard: ExaminationBoard): Promise<ExaminationBoard> {
        throw new Error("Method not implemented.");
    }

    fetchExaminationBoard(): Promise<ExaminationBoard[]> {
        throw new Error("Method not implemented.");
    }

    getExaminationBoardById(examinationBoardId: string): Promise<ExaminationBoard | null> {
        throw new Error("Method not implemented.");
    }

    getExaminationBoardByProfessorId(professorId: string): Promise<ExaminationBoard[] | null> {
        throw new Error("Method not implemented.");
    }

    deleteExaminationBoard(examinationBoardId: string): Promise<ExaminationBoard | null> {
        throw new Error("Method not implemented.");
    }

    updateExaminationBoard(examinationBoardId: string, professorIdList: string[]): Promise<ExaminationBoard | null> {
        throw new Error("Method not implemented.");
    }

}