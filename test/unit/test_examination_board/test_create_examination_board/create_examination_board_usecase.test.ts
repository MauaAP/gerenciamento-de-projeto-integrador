import { CreateExaminationBoardUseCase } from "app/modules/examination_board/create_examination_board/create_examination_board_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("CreateExaminationBoardUseCase", () => {
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let userRepo: UserRepoMock;
    let useCase: CreateExaminationBoardUseCase;

    beforeEach(() => {
        examinationBoardRepo = new ExaminationBoardRepoMock();
        userRepo = new UserRepoMock();
        useCase = new CreateExaminationBoardUseCase(examinationBoardRepo, userRepo);
    });

    it("should create a new examination board and return it with user names", async () => {
        const request = {
            professorIdList: [
                "a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3",
                "c3d2e4f4-8b1a-47c2-88ff-d3e6d683b5e5"
            ]
        };

        const result = await useCase.execute(request);

        expect(result.newExaminationBoard).toBeDefined();
        expect(result.newExaminationBoard.professorIdList).toEqual(request.professorIdList);
        expect(result.professorNameList).toEqual([
            "Roberto Carlos",
            "Ana Maria Braga"
        ]);
    });


    it("should throw BadRequestException if any user does not exist", async () => {
        try {
            const request = {
                professorIdList: [
                    "46ba0946-aebd-4b4e-8374-9fafe4621cb8",
                    "fff0ac7a-7447-4161-909c-e1714827dd68"
                ]
            };
            await useCase.execute(request)
        }
        catch(error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("Algum usuário selecionado não está no banco");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should throw BadRequestException if any user is not a professor", async () => {
        try {
            const request = {
                professorIdList: [
                    "f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389", // Luke Skywalker - STUDENT
                    "c3d2e4f4-8b1a-47c2-88ff-d3e6d683b5e5"  // Ana Maria Braga - PROFESSOR
                ]
            };
            await useCase.execute(request);
        }
        catch(error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("Algum usuário selecionado não é professor");
            expect(error.statusCode).toBe(400);
        }
    });

});