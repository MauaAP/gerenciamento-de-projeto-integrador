
import { DeleteExaminationBoardUseCase } from "app/modules/examination_board/delete_examination_board/delete_examination_board_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("DeleteExaminationBoardUsecase", () =>{
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let usecase: DeleteExaminationBoardUseCase;

    beforeEach(() =>{
        examinationBoardRepo= new ExaminationBoardRepoMock();
        usecase= new DeleteExaminationBoardUseCase(examinationBoardRepo);
    });

    it("should delete the examination board from repository mock and return it", async () => {
        const result= await usecase.execute("d7e6218a-001b-4fd6-9d97-ddf985f6ab5b");

        expect(result.examinationBoardId).toBe("d7e6218a-001b-4fd6-9d97-ddf985f6ab5b");
    });

    it("should throw NotFoundException if id doesnt's exist", async () =>{
        try {
            await usecase.execute("00000000-0000-0000-0000-000000000000");
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Banca avaliadora não esta no banco");
            expect(error.statusCode).toBe(404);
        }
    });
});