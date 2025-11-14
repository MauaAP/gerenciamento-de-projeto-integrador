import { GetPresentationUseCase } from "app/modules/presentation/get_presentation/get_presentation_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { PresentationRepoMock } from "app/shared/repositories/mocks/presentation_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { ClassroomRepoMock } from "app/shared/repositories/mocks/classroom_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("GetExaminationBoardUsecase", () => {
    let presentationRepo: PresentationRepoMock;
    let groupRepo: GroupRepoMock;
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let userRepo: UserRepoMock;
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let classroomRepo: ClassroomRepoMock;
    let useCase: GetPresentationUseCase;
    
    beforeEach(() => {
        presentationRepo = new PresentationRepoMock();
        groupRepo = new GroupRepoMock();
        examinationBoardRepo = new ExaminationBoardRepoMock();
        userRepo = new UserRepoMock();
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        classroomRepo = new ClassroomRepoMock();
        useCase = new GetPresentationUseCase(presentationRepo, groupRepo, examinationBoardRepo, userRepo, projectRepo, partnerRepo, classroomRepo);
    });

    it("should get the presentation by id and return it, with group, examination board, user names and project title", async () => {
        const result = await useCase.execute({ id: "8c77b6b9-a249-4318-a982-b07972bd1fb9" });

        expect(result[0].id).toBe("8c77b6b9-a249-4318-a982-b07972bd1fb9");
        expect(result[0].date).toBe(1750854600000);
        expect(result[0].group.codSubj).toBe("TTI202");
        expect(result[0].group.userNameList).toEqual([
            "Luke Skywalker",
            "Peter Parker",
            "Clark Kent",
            "Nuncio Perrela"
        ]);
        expect(result[0].group.yearSem).toBe(202501);
        expect(result[0].group.project.title).toBe("Bot de investimentos com a Mastercard");
        expect(result[0].group.project.partnerName).toBe("Mastercard");
        expect(result[0].group.project.extensionHours).toBeUndefined();
        expect(result[0].group.course).toBe("CIÊNCIAS DA COMPUTAÇÃO");
        expect(result[0].examinationBoard.porfessorNameList).toEqual([
            "Roberto Carlos",
            "Bruce Wayne"
        ]);
    });

    it("should get the presentations by filter and return them, with group, examination board, user names and project title", async () => {
        const result = await useCase.execute({ presentationFilter: { date: 1719235800000 } });

        expect(result.length).toBe(2);

        expect(result[0].id).toBe("4bf04c45-818e-496d-a308-71ef827f175d");
        expect(result[0].date).toBe(1719235800000);
        expect(result[0].group.codSubj).toBe("TTI101");
        expect(result[0].group.userNameList).toEqual([
            "Diana Prince",
            "Barry Allen",
        ]);
        expect(result[0].group.yearSem).toBe(202401);
        expect(result[0].group.project.title).toBe("Show do milhão poliedro");
        expect(result[0].group.project.partnerName).toBe("Poliedro");
        expect(result[0].group.project.extensionHours).toBe(216000);
        expect(result[0].group.course).toBe("CIÊNCIAS DA COMPUTAÇÃO");
        expect(result[0].examinationBoard.porfessorNameList).toEqual([
            "Roberto Carlos",
            "Ana Maria Braga",
            "Bruce Wayne"
        ]);

        expect(result[1].id).toBe("a259782e-f3bf-4cd5-b335-b178d8306cbe");
        expect(result[1].date).toBe(1719235800000);
        expect(result[1].group.codSubj).toBe("RIN201");
        expect(result[1].group.userNameList).toEqual([
            "Hal Jordan",
            "Arthur Curry"
        ]);
        expect(result[1].group.yearSem).toBe(202502);
        expect(result[1].group.project.title).toBe("Cuidando do meio ambiente com a Klabin");
        expect(result[1].group.project.partnerName).toBe("Klabin");
        expect(result[1].group.project.extensionHours).toBe(216000);
        expect(result[1].group.course).toBe("RELAÇÕES INTERNACIONAIS");
        expect(result[1].examinationBoard.porfessorNameList).toEqual([
            "Roberto Carlos",
            "Bruce Wayne"
        ]);
    });

    it("should throw NotFoundException when presentation not found by id", async () => {
        try {
            await useCase.execute({ id: "non-existent-id" });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Nenhuma apresentação encontrada");
            expect(error.statusCode).toBe(404);
        }
    });

    it("should throw NotFoundException when presentation not found by filter", async () => {
        try {
            await useCase.execute({ presentationFilter: { date: 9999999999999 } });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Nenhuma apresentação encontrada");
            expect(error.statusCode).toBe(404);
        }
    });
});
