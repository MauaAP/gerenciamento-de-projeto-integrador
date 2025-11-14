import { UpdatePresentationUseCase } from "app/modules/presentation/update_presentation/update_presentation_usecase";
import { ExaminationBoardRepoMock } from "app/shared/repositories/mocks/examiantion_board_repository_mock";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { PresentationRepoMock } from "app/shared/repositories/mocks/presentation_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { ClassroomRepoMock } from "app/shared/repositories/mocks/classroom_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdatePresentationUseCase", () => {
    let presentationRepo: PresentationRepoMock;
    let groupRepo: GroupRepoMock;
    let examinationBoardRepo: ExaminationBoardRepoMock;
    let userRepo: UserRepoMock;
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let classroomRepo: ClassroomRepoMock;
    let useCase: UpdatePresentationUseCase;

    beforeEach(() => {
        presentationRepo = new PresentationRepoMock();
        groupRepo = new GroupRepoMock();
        examinationBoardRepo = new ExaminationBoardRepoMock();
        userRepo = new UserRepoMock();
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        classroomRepo = new ClassroomRepoMock();
        useCase = new UpdatePresentationUseCase(presentationRepo, groupRepo, examinationBoardRepo, userRepo, projectRepo, partnerRepo, classroomRepo);
    });

    it("should update the presentation in repository mock and return it, with group, examination board, user names and project title", async () => {
        const result= await useCase.execute({ 
            id: "8c77b6b9-a249-4318-a982-b07972bd1fb9", 
            updateOptions: { 
                date: 1750854600000, 
                groupId: "25f08e4d-e41a-4c5f-9c3b-8835e2f65c43", examinationBoardId: "d28a5fcb-22e8-4955-b6cd-b48986e41176" 
            } 
        })

        expect(result.id).toBe("8c77b6b9-a249-4318-a982-b07972bd1fb9")
        expect(result.date).toBe(1750854600000)
        expect(result.group.codSubj).toBe("TTI101")
        expect(result.group.yearSem).toBe(202401)
        expect(result.group.course).toBe("CIÊNCIAS DA COMPUTAÇÃO")
        expect(result.group.userNameList).toEqual([
            "Luke Skywalker", 
            "Peter Parker", 
            "Clark Kent",
            "Nuncio Perrela"
        ])
        expect(result.group.project.title).toBe("Show do milhão poliedro")
        expect(result.group.project.partnerName).toBe("Poliedro")
        expect(result.group.project.extensionHours).toBe(216000)
        expect(result.examinationBoard.porfessorNameList).toEqual([
            "Tony Stark",
            "Steve Rogers"
        ])
    });

    it("should throw NotFoundException if id doesn't exist", async () => {
        try {
            await useCase.execute({ id: "00000000-0000-0000-0000-000000000000", updateOptions: { date: 1750854600000 } });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Apresentação não está no banco")
            expect(error.statusCode).toBe(404);
        }
    });

    it("should throw NotFoundException if group doesn't exist", async () => {
        try {
            await useCase.execute({ id: "8c77b6b9-a249-4318-a982-b07972bd1fb9", updateOptions: { groupId: "00000000-0000-0000-0000-000000000000" } });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Grupo não está no banco")
            expect(error.statusCode).toBe(404);
        }
    });

    it("should throw NotFoundException if examination board doesn't exist", async () => {
        try {
            await useCase.execute({ id: "8c77b6b9-a249-4318-a982-b07972bd1fb9", updateOptions: { examinationBoardId: "00000000-0000-0000-0000-000000000000" } });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Banca avaliadora não está no banco")
            expect(error.statusCode).toBe(404);
        }
    });
});