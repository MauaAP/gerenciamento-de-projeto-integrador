import { DeleteProjectUseCase } from "app/modules/project/delete_project/delete_project_usecase";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("DeleteProjectUsecase", () =>{
    let projectRepo: ProjectRepoMock
    let useCase: DeleteProjectUseCase

    beforeEach(() =>{
        projectRepo= new ProjectRepoMock();
        useCase= new DeleteProjectUseCase(projectRepo);
    });

    it("should delete the project from repository mock and return it", async () => {
        const result= await useCase.execute("470f1e7b-f645-4da6-9b59-2e7a9684b0cf")

        expect(result.projectId).toBe("470f1e7b-f645-4da6-9b59-2e7a9684b0cf")
        expect(result.title).toBe("Desenvolvimento do site do Rokuzen")
        expect(result.partnerId).toBe("61d2408e-8b16-402b-9ee8-e1d9bc9b2ab3")
        expect(result.extensionHours).toBe(undefined)
    });

    it("should throw NotFoundException if id doesnt's exist", async () =>{
        try {
            await useCase.execute("470f1e7b-f645-4da6-9b59-2e7a9684b0c")
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Projeto não está no banco")
            expect(error.statusCode).toBe(404)
        }
    });
});