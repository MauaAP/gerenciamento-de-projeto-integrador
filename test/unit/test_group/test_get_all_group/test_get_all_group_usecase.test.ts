import { GetAllGroupsUseCase } from "app/modules/group/get_all_groups/get_all_groups_usecase";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("GetAllGroupUseCase", () => {
    let groupRepo: GroupRepoMock;
    let userRepo: UserRepoMock;
    let projectRepo: ProjectRepoMock;
    let usecase: GetAllGroupsUseCase;

    beforeEach(() => {
        groupRepo = new GroupRepoMock();
        userRepo = new UserRepoMock();
        projectRepo = new ProjectRepoMock();
        usecase = new GetAllGroupsUseCase(groupRepo, userRepo, projectRepo);
    });

    it("should return all groups with user names and project titles", async () => {
        const result =  await usecase.execute();

        expect(result.length).toBe(6);

        expect(result[0].id).toBe("14e97d3c-d309-43d4-bfa0-7724e1e54fb2");
        expect(result[0].codSubj).toBe("TTI202");
        expect(result[0].userNameList).toEqual(["Luke Skywalker", "Peter Parker", "Clark Kent", "Nuncio Perrela"]);
        expect(result[0].yearSem).toBe(202501);
        expect(result[0].projectTitle).toBe("Bot de investimentos com a Mastercard");
        expect(result[0].course).toBe("CIÊNCIAS DA COMPUTAÇÃO");

        expect(result[5].id).toBe("5b9d4100-13f5-4bd9-92b3-0a420bb3d3e3");
        expect(result[5].codSubj).toBe("ENG101");
        expect(result[5].userNameList).toEqual(["Luke Skywalker", "Hal Jordan"]);
        expect(result[5].yearSem).toBe(202301);
        expect(result[5].projectTitle).toBe("Fazendo circuitos com a GM");
        expect(result[5].course).toBe("ENGENHARIA DE PRODUÇÃO");
    });
});