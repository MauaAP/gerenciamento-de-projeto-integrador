import { GetAllExaminationBoardsUseCase } from "app/modules/examination_board/get_all_examination_boards/get_all_examination_boards_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("GetAllExaminationBoardsUseCase", () => {
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let userRepo: UserRepoMock;
    let usecase: GetAllExaminationBoardsUseCase;
    
    beforeEach(() => {
        examinationBoardRepo = new ExaminationBoardRepoMock();
        userRepo = new UserRepoMock();
        usecase= new GetAllExaminationBoardsUseCase(examinationBoardRepo, userRepo);
    });

    it("should return all examination boards with professor names", async () => {
        const result =  await usecase.execute();

        expect(result.length).toBe(5);

        expect(result[0].id).toBe("d7e6218a-001b-4fd6-9d97-ddf985f6ab5b");
        expect(result[0].professorNameList).toEqual(["Roberto Carlos", "Ana Maria Braga", "Bruce Wayne"]);

        expect(result[4].id).toBe("a28ed23d-3660-4ed4-b384-b1c12920c8d4");
        expect(result[4].professorNameList).toEqual(["Tony Stark", "Steve Rogers"]);
    });
});