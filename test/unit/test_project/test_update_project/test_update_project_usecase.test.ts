import { UpdateProjectUseCase } from "app/modules/project/update_project/update_project_usecase"
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock"
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock"
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdateProjectUseCase", () => {
    let projectRepo: ProjectRepoMock
    let partnerRepo: PartnerRepoMock
    let projectUseCase: UpdateProjectUseCase

    beforeEach(() => {
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        projectUseCase = new UpdateProjectUseCase(projectRepo, partnerRepo);
    });

    it("should update the project in repository mock and return it with the partnerName", async () => {
        const result = await projectUseCase.execute({ id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", updateOptions: { title: "Project Teste", partnerId: "574478f6-a764-4c0e-a24a-febad942156f", extensionHours: 100 } })

        expect(result.updatedProject.projectId).toBe("470f1e7b-f645-4da6-9b59-2e7a9684b0cf")
        expect(result.updatedProject.title).toBe("Project Teste")
        expect(result.partnerName).toBe("Poliedro")
        expect(result.updatedProject.extensionHours).toBe(100)
    });

    it("should update only the title of the project in repository mock and return it with the partnerName", async () => {
        const result = await projectUseCase.execute({ id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", updateOptions: { title: "Project Teste" } })

        expect(result.updatedProject.projectId).toBe("470f1e7b-f645-4da6-9b59-2e7a9684b0cf")
        expect(result.updatedProject.title).toBe("Project Teste")
        expect(result.partnerName).toBe("Rokuzen")
        expect(result.updatedProject.extensionHours).toBeUndefined()
    });

    it("should update only the partnerId of the project in repository mock and return it with the partnerName", async () => {
        const result = await projectUseCase.execute({ id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", updateOptions: { partnerId: "574478f6-a764-4c0e-a24a-febad942156f" } })

        expect(result.updatedProject.projectId).toBe("470f1e7b-f645-4da6-9b59-2e7a9684b0cf")
        expect(result.updatedProject.title).toBe("Desenvolvimento do site do Rokuzen")
        expect(result.partnerName).toBe("Poliedro")
        expect(result.updatedProject.extensionHours).toBeUndefined()
    });

    it("should update only the extensionHours of the project in repository mock and return it with the partnerName", async () => {
        const result = await projectUseCase.execute({ id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", updateOptions: { extensionHours: 100 } })

        expect(result.updatedProject.projectId).toBe("470f1e7b-f645-4da6-9b59-2e7a9684b0cf")
        expect(result.updatedProject.title).toBe("Desenvolvimento do site do Rokuzen")
        expect(result.partnerName).toBe("Rokuzen")
        expect(result.updatedProject.extensionHours).toBe(100)
    });

    it("should throw NotFoundException if id doesn't exist", async () => {
        try {
            await projectUseCase.execute({ id: "574478f6-a764-4c0e-a24a-febad9421567", updateOptions: { title: "Project Teste" } });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Projeto não está no banco")
        }
    });

    it("should throw BadRequestException if partnerId doesn't exist", async () => {
        try {
            await projectUseCase.execute({ id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", updateOptions: { partnerId: "574478f6-a764-4c0e-a24a-febad9421567" } });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O parceiro selecionado não está no banco")
        }
    });
});
