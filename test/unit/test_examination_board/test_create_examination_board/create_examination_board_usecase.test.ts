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
            examinerIdList: ["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389", "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4"],
            thesisId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf"
        };

        const result = await useCase.execute(request);

        expect(result.newExaminationBoard.examinerIdList).toEqual(["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389", "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4"]);
        expect(result.newExaminationBoard.thesisId).toBe("470f1e7b-f645-4da6-9b59-2e7a9684b0cf");
        expect(result.userNameList).toEqual(["Luke Skywalker", "Nuncio Perrela"]);
    });

});