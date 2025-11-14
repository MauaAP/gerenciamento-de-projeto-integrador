import { IExaminationBoardRepository } from "../../../../shared/domain/interfaces/IExaminationBoardRepository";
import type { DynamoDBResources } from "./dynamo_datasource";
import { ExaminationBoard } from "../../../../shared/domain/entities/examination_board";

function getExaminationBoardPK(examinationBoardId: string): string {
  return `BANCA#${examinationBoardId}`;
}

function getExaminationBoardSK(): string {
  return "METADATA";
}

export class ExaminationBoardRepositoryDynamoDB implements IExaminationBoardRepository {
    private db: DynamoDBResources;

    constructor(db: DynamoDBResources) {
        this.db = db;
    }

    async createExaminationBoard(examinationBoard: ExaminationBoard): Promise<ExaminationBoard> {
        const pk = getExaminationBoardPK(examinationBoard.examinationBoardId);
        const sk = getExaminationBoardSK();

        const item = {
            PK: pk,
            SK: sk,
            ...examinationBoard.toJson()
        };

        await this.db.put(item, pk, sk);
        console.log(`[DynamoDB] Banca criada: ${pk}`);
        
        return examinationBoard;
    }

    async fetchExaminationBoard(): Promise<ExaminationBoard[]> {
        const items = await this.db.scanAll({
            FilterExpression: "begins_with(#pk, :bancaPrefix) AND #sk = :metadata",
            ExpressionAttributeNames: { 
                "#pk": "PK",
                "#sk": "SK"
            },
            ExpressionAttributeValues: { 
                ":bancaPrefix": "BANCA#",
                ":metadata": "METADATA"
            },
        });
        console.log(`[DynamoDB] FetchExaminationBoard retornou ${items.length} itens`);
        return items.map(ExaminationBoard.fromJson);
    }

    async getExaminationBoardById(examinationBoardId: string): Promise<ExaminationBoard | null> {
        const pk = getExaminationBoardPK(examinationBoardId);
        const sk = getExaminationBoardSK();

        const item = await this.db.get(pk, sk);

        if (item) {
            console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
            return ExaminationBoard.fromJson(item);
        }

        console.log(`[DynamoDB] Busca por ID: ${examinationBoardId} - Não encontrado`);
        return null;
    }

    async getExaminationBoardByProfessorId(professorId: string): Promise<ExaminationBoard[] | null> {
        // Buscar todas as bancas e filtrar por professorId
        const allBoards = await this.fetchExaminationBoard();
        
        const filteredBoards = allBoards.filter(board => 
            board.professorIdList.includes(professorId)
        );

        console.log(
            `[DynamoDB] Busca por ProfessorId: ${professorId} - ${
                filteredBoards.length > 0 ? `${filteredBoards.length} bancas encontradas` : "Nenhuma banca encontrada"
            }`
        );

        return filteredBoards.length > 0 ? filteredBoards : null;
    }

    async deleteExaminationBoard(examinationBoardId: string): Promise<ExaminationBoard | null> {
        const examinationBoard = await this.getExaminationBoardById(examinationBoardId);

        if (!examinationBoard) {
            return null;
        }

        const pk = getExaminationBoardPK(examinationBoardId);
        const sk = getExaminationBoardSK();

        await this.db.delete(pk, sk);
        console.log(`[DynamoDB] Banca deletada: ${pk}`);

        return examinationBoard;
    }

    async updateExaminationBoard(examinationBoardId: string, professorIdList: string[]): Promise<ExaminationBoard | null> {
        const currentBoard = await this.getExaminationBoardById(examinationBoardId);

        if (!currentBoard) {
            return null;
        }

        const pk = getExaminationBoardPK(examinationBoardId);
        const sk = getExaminationBoardSK();

        const updateDict = {
            professorIdList: professorIdList
        };

        const updated = await this.db.update(pk, sk, updateDict);
        console.log(`[DynamoDB] Banca atualizada: ${pk}`);

        return ExaminationBoard.fromJson(updated);
    }
}