import { GetAllPresentationsUseCase } from "app/modules/presentation/get_all_presentations/get_all_presentations_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { PresentationRepoMock } from "app/shared/repositories/mocks/presentation_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("GetAllPresentationsUseCase", () => {
    let presentationRepo: PresentationRepoMock;
    let groupRepo: GroupRepoMock;
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let userRepo: UserRepoMock;
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let useCase: GetAllPresentationsUseCase;

    beforeEach(() => {
        presentationRepo = new PresentationRepoMock();
        groupRepo = new GroupRepoMock();
        examinationBoardRepo = new ExaminationBoardRepoMock();
        userRepo = new UserRepoMock();
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        useCase = new GetAllPresentationsUseCase(presentationRepo, groupRepo, examinationBoardRepo, userRepo, projectRepo, partnerRepo);
    });

    it("should return all presentations from repository mock, with group, examination board, user names and project title", async () => {
        const result= await useCase.execute()

        expect(result.length).toBe(6)

        expect(result[0].id).toBe("8c77b6b9-a249-4318-a982-b07972bd1fb9")
        expect(result[0].date).toBe(1750854600000)
        expect(result[0].classRoom).toBe("Sala A101")
        expect(result[0].group.codSubj).toBe("TTI202")
        expect(result[0].group.yearSem).toBe(202501)
        expect(result[0].group.course).toBe("CIÊNCIAS DA COMPUTAÇÃO")
        expect(result[0].group.userNameList).toEqual([
            "Luke Skywalker", 
            "Peter Parker", 
            "Clark Kent",
            "Nuncio Perrela"
        ])
        expect(result[0].group.project.title).toBe("Bot de investimentos com a Mastercard")
        expect(result[0].group.project.partnerName).toBe("Mastercard")
        expect(result[0].group.project.extensionHours).toBe(undefined)
        expect(result[0].examinationBoard.porfessorNameList).toEqual([
            "Roberto Carlos",
            "Bruce Wayne"
        ])

        expect(result[5].id).toBe("310b65d0-eec0-4712-83dc-b1fb5c29400c")
        expect(result[5].date).toBe(1687266600000)
        expect(result[5].classRoom).toBe("Sala E505")
        expect(result[5].group.codSubj).toBe("ENG101")
        expect(result[5].group.yearSem).toBe(202301)
        expect(result[5].group.course).toBe("ENGENHARIA DE PRODUÇÃO")
        expect(result[5].group.userNameList).toEqual([
            "Luke Skywalker",
            "Hal Jordan"
        ])
        expect(result[5].group.project.title).toBe("Fazendo circuitos com a GM")
        expect(result[5].group.project.partnerName).toBe("General Motors")
        expect(result[5].group.project.extensionHours).toBe(undefined)
        expect(result[5].examinationBoard.porfessorNameList).toEqual([
            "Roberto Carlos",
            "Bruce Wayne"
        ])



    });
});