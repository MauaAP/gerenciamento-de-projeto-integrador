import { CreatePresentationUseCase } from "app/modules/presentation/create_presentation/create_presentation_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { PresentationRepoMock } from "app/shared/repositories/mocks/presentation_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("CreatePresentationUseCase", () => {
    let presentationRepo: PresentationRepoMock;
    let groupRepo: GroupRepoMock;
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let userRepo: UserRepoMock;
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let useCase: CreatePresentationUseCase;

    beforeEach(() => {
        presentationRepo = new PresentationRepoMock();
        groupRepo = new GroupRepoMock();
        examinationBoardRepo = new ExaminationBoardRepoMock();
        userRepo = new UserRepoMock();
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        useCase = new CreatePresentationUseCase(presentationRepo, groupRepo, examinationBoardRepo, userRepo, projectRepo, partnerRepo);
    });

    it("should create a new presentation and return it with group, examination board, user names, project title and partner name", async () => {
        const request = {
            date: 1770000000000,
            groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
            examinationBoardId: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b",
            classRoom: "Sala 101"
        };

        const result = await useCase.execute(request);

        expect(result.id).toBeDefined();
        expect(result.date).toEqual(request.date);
        // expect(result.groupId).toEqual(request.groupId);
        // expect(result.examinationBoardId).toEqual(request.examinationBoardId);
        // expect(result.existingGroup.groupId).toEqual(request.groupId);
        // expect(result.existingExaminationBoard.examinationBoardId).toEqual(request.examinationBoardId);
        expect(result.group.codSubj).toEqual("TTI202");
        expect(result.group.userNameList).toEqual([
            "Luke Skywalker",
            "Peter Parker",
            "Clark Kent",
            "Nuncio Perrela"
        ]);
        expect(result.group.yearSem).toEqual(202501);
        expect(result.group.project.title).toEqual("Bot de investimentos com a Mastercard");
        expect(result.group.project.partnerName).toEqual("Mastercard");
        expect(result.group.project.extensionHours).toBeUndefined();
        expect(result.group.course).toEqual("CIÊNCIAS DA COMPUTAÇÃO");
        expect(result.examinationBoard.porfessorNameList).toEqual([
            "Roberto Carlos",
            "Ana Maria Braga",
            "Bruce Wayne"
        ]);

    });

    it("should throw NotFoundException if group does not exist", async () => {
        try {
            const request = {
                date: 1770000000000,
                groupId: "non-existent-group-id",
                examinationBoardId: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b",
                classRoom: "Sala 101"
            };
            await useCase.execute(request)
        }
        catch (error: any) {
            expect(error.name).toBe("NotFoundException");
            expect(error.message).toBe("Grupo não está no banco");
            expect(error.statusCode).toBe(404);
        }
    });

    it("should throw NotFoundException if examination board does not exist", async () => {
        try {
            const request = {
                date: 1770000000000,
                groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
                examinationBoardId: "non-existent-examination-board-id",
                classRoom: "Sala 101"
            };
            await useCase.execute(request)
        }
        catch (error: any) {
            expect(error.name).toBe("NotFoundException");
            expect(error.message).toBe("Banca avaliadora selecionada não está no banco");
            expect(error.statusCode).toBe(404);
        }
    });
});