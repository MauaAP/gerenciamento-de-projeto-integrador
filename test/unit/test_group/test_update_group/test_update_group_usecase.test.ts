import { UpdateGroupUseCase } from "app/modules/group/update_group/update_group_usecase";
import { COURSE } from "app/shared/domain/enums/course";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { CourseRepoMock } from "app/shared/repositories/mocks/course_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdateGroupUseCase", () => {
    let groupRepo: GroupRepoMock;
    let userRepo: UserRepoMock;
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let courseRepo: CourseRepoMock;
    let useCase: UpdateGroupUseCase


    beforeEach(() => {
            groupRepo = new GroupRepoMock();
            userRepo = new UserRepoMock();
            projectRepo = new ProjectRepoMock();
            partnerRepo = new PartnerRepoMock();
            courseRepo = new CourseRepoMock();
            useCase = new UpdateGroupUseCase(groupRepo, userRepo, projectRepo, partnerRepo, courseRepo);
    });

    it("should update the group in repository mock and return it, with user names and project title", async () => {
        const result= await useCase.execute({ id: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2", updateOptions: { codSubj: "TTI303", yearSem: 202502, course: COURSE.SIN, userIdList: ["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389", "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4"], projectId: "4d2419c0-4955-4412-900f-e1d49b87f92b" } })

        expect(result.id).toBe("14e97d3c-d309-43d4-bfa0-7724e1e54fb2")
        expect(result.codSubj).toBe("TTI303")
        expect(result.yearSem).toBe(202502)
        expect(result.course).toBe("SISTEMAS DE INFORMAÇÃO")
        expect(result.userNameList).toEqual(["Luke Skywalker", "Nuncio Perrela"])
        expect(result.project.title).toBe("Bot de investimentos com a Mastercard")
        expect(result.project.partnerName).toBe("Mastercard")
        expect(result.project.extensionHours).toBe(undefined)
    });

    it("should throw NotFoundException if id doesn't exist", async () => {
        try {
            await useCase.execute({ id: "00000000-0000-0000-0000-000000000000", updateOptions: { codSubj: "TTI303" } });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Grupo não está no banco")
        }
    });

    it("should throw BadRequestException if any user does not exist", async () => {
        try {
            await useCase.execute({ id: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2", updateOptions: { userIdList: ["00000000-0000-0000-0000-000000000000"] } });
        }
        catch (error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("Algum usuário selecionado não está no banco");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should throw BadRequestException if project does not exist", async () => {
        try {
            await useCase.execute({ id: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2", updateOptions: { projectId: "00000000-0000-0000-0000-000000000000" } });
        }
        catch (error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("O projeto selecionado não está no banco");
            expect(error.statusCode).toBe(400);
        }
    });
});