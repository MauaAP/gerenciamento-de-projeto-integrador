import { UpdateExaminationBoardUseCase } from "app/modules/examination_board/update_examination_board/update_examination_board_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdateExaminationBoardUseCase", () => {
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let useCase: UpdateExaminationBoardUseCase;
    let userRepo: UserRepoMock;

    beforeEach(() => {
            examinationBoardRepo = new ExaminationBoardRepoMock();
            userRepo = new UserRepoMock();
            useCase = new UpdateExaminationBoardUseCase(examinationBoardRepo, userRepo);
    });

    it("should update the examination board in repository mock and return it", async () => {
        const result= await useCase.execute({ id: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b", newProfessorIdList: ["a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3", "d4e3f5g5-7h8i-49j0-99gg-h1i2j3k4l5m6"] })

        expect(result.updatedExaminationBoard.examinationBoardId).toBe("d7e6218a-001b-4fd6-9d97-ddf985f6ab5b")
        expect(result.updatedExaminationBoard.professorIdList).toEqual(["a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3", "d4e3f5g5-7h8i-49j0-99gg-h1i2j3k4l5m6"])
        expect(result.professorNameList).toEqual(["Roberto Carlos", "Bruce Wayne"])
    });

    it("should throw NotFoundException if id doesn't exist", async () => {
        try {
            await useCase.execute({ id: "00000000-0000-0000-0000-000000000000", newProfessorIdList: ["a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3"] });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Banca avaliadora selecionada não esta no banco")
        }
    });

    it("should throw BadRequestException if any professor does not exist", async () => {
        try {
            await useCase.execute({ id: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b", newProfessorIdList: ["00000000-0000-0000-0000-000000000000"] });
        }
        catch (error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("Algum professor selecionado não está no banco");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should throw BadRequestException if any user is not a professor", async () => {
        try {
            await useCase.execute({ id: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b", newProfessorIdList: ["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389"] });
        }
        catch (error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("Algum usuário selecionado não é professor");
            expect(error.statusCode).toBe(400);
        }
    });
});