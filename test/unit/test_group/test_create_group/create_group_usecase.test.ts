import { CreateGroupUseCase } from "app/modules/group/create_group/create_group_usecase";
import { COURSE } from "app/shared/domain/enums/course";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { CourseRepoMock } from "app/shared/repositories/mocks/course_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("CreateGroupUseCase", () => {
    let groupRepo: GroupRepoMock;
    let userRepo: UserRepoMock;
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let courseRepo: CourseRepoMock;
    let useCase: CreateGroupUseCase;

    beforeEach(() => {
        groupRepo = new GroupRepoMock();
        userRepo = new UserRepoMock();
        projectRepo = new ProjectRepoMock();
        partnerRepo= new PartnerRepoMock();
        courseRepo = new CourseRepoMock();
        useCase = new CreateGroupUseCase(groupRepo, userRepo, projectRepo, partnerRepo, courseRepo);
    });

    it("should create a new group and return it with user names and project title", async () => {
        const request = {
            codSubj: "MAT101",
            userIdList: ["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389", "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4", "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7"],
            yearSem: 202501,
            projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            course: COURSE.CIC
        };

        const result = await useCase.execute(request);

        expect(result.codSubj).toBe("MAT101");
        expect(result.course).toBe("CIÊNCIAS DA COMPUTAÇÃO");
        expect(result.userNameList).toEqual(["Luke Skywalker", "Nuncio Perrela", "Peter Parker"]);
        expect(result.yearSem).toBe(202501);
        expect(result.project.title).toBe("Desenvolvimento do site do Rokuzen");
        expect(result.project.partnerName).toBe("Rokuzen");
        expect(result.project.extensionHours).toBe(undefined);
    });

    it("should throw BadRequestException if any user does not exist", async () => {
        try {
            const request = {
                codSubj: "MAT101",
                userIdList: ["8ab16a79-c730-4177-ab73-1520d7ceb141"],
                yearSem: 202501,
                projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
                course: COURSE.CIC
            };
            await useCase.execute(request);
        }
        catch (error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("Algum usuário selecionado não está no banco");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should throw BadRequestException if project does not exist", async () => {
        try {
            const request = {
                codSubj: "MAT101",
                userIdList: ["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389"],
                yearSem: 202501,
                projectId: "00000000-0000-0000-0000-000000000000",
                course: COURSE.CIC
            };
            await useCase.execute(request);
        }
        catch (error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("Projeto selecionado não está no banco");
            expect(error.statusCode).toBe(400);
        }
    });
});