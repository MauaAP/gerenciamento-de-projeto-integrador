import { GetExaminationBoardUseCase } from "app/modules/examination_board/get_examination_board/get_examination_board_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock"
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("GetExaminationBoardUsecase", () => {
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let userRepo: UserRepoMock;
    let usecase: GetExaminationBoardUseCase;

    beforeEach(() => {
        examinationBoardRepo = new ExaminationBoardRepoMock();
        userRepo = new UserRepoMock();
        usecase= new GetExaminationBoardUseCase(examinationBoardRepo, userRepo);
    });

    it("should get the examination board by id in repository mock and return it, with professor names", async () => {
        const result= await usecase.execute({ id: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b" })

        expect(result[0].id).toBe("d7e6218a-001b-4fd6-9d97-ddf985f6ab5b")
        expect(result[0].professorNameList).toEqual([
            "Roberto Carlos",
            "Ana Maria Braga",
            "Bruce Wayne"
        ])
    });

    it("should get the examination boards by professor id in repository mock and return them, with professor names", async () => {
        const result= await usecase.execute({ professorId: "5157e667-0a2c-45fb-acd3-7a56063db9b1" })

        expect(result.length).toBe(3)

        expect(result[0].id).toBe("bf344b2b-b79a-45dc-99e8-798df38f03fe")
        expect(result[0].professorNameList).toEqual([
            "Bruce Wayne",
            "Tony Stark"
        ])

        expect(result[1].id).toBe("d28a5fcb-22e8-4955-b6cd-b48986e41176")
        expect(result[1].professorNameList).toEqual([
            "Tony Stark",
            "Steve Rogers"
        ])

        expect(result[2].id).toBe("a28ed23d-3660-4ed4-b384-b1c12920c8d4")
        expect(result[2].professorNameList).toEqual([
            "Tony Stark",
            "Steve Rogers"
        ])
    });

    it("should throw NotFoundException when examination board not found by id", async () => {
        try {
            await usecase.execute({ id: "non-existent-id" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException")
            expect(error.message).toBe("Nenhuma Banca avaliadora encontrada")
            expect(error.statusCode).toBe(404)
        }
    });

    it("should throw NotFoundException when examination board not found by professor id", async () => {
        try {
            await usecase.execute({ professorId: "non-existent-professor-id" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException")
            expect(error.message).toBe("Nenhuma Banca avaliadora encontrada")
            expect(error.statusCode).toBe(404)
        }
    });
})