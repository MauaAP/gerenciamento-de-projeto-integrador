
import { GetAllProjectsUseCase } from "app/modules/project/get_all_projects/get_all_projects_usecase";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdateProjectUsecase", () => {
    let projectRepo: ProjectRepoMock
    let partnerRepo: PartnerRepoMock
    let projectUseCase: GetAllProjectsUseCase
    
    beforeEach(() => {
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        projectUseCase = new GetAllProjectsUseCase(projectRepo, partnerRepo);
    });

    it("should return all projects in repository mock", async () => {
        const result = await projectUseCase.execute();

        expect(result.length).toBe(7);
        expect(result[0].projectId).toBe("470f1e7b-f645-4da6-9b59-2e7a9684b0cf");
        expect(result[0].title).toBe("Desenvolvimento do site do Rokuzen");
        expect(result[0].partnerName).toBe("Rokuzen");
    });

});