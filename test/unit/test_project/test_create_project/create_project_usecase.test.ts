import { CreateProjectUseCase } from "app/modules/project/create_project/create_project_usecase";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("CreateProjectUseCase", () => {
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let useCase: CreateProjectUseCase;

    beforeEach(() => {
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        useCase = new CreateProjectUseCase(projectRepo, partnerRepo);
    });

    it("should create a new project and return it with partner name", async () => {
        const request = {
            title: "Test Project",
            partnerId: "574478f6-a764-4c0e-a24a-febad942156f",
            extensionHours: 10
        };

        const result = await useCase.execute(request);

        expect(result.newProject.title).toBe("Test Project");
        expect(result.newProject.partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f");
        expect(result.newProject.extensionHours).toBe(10);
        expect(result.partnerName).toBe("Poliedro");
    });

    it("should create a new project without extension hours", async () => {
        const request = {
            title: "Test Project No Extension",
            partnerId: "574478f6-a764-4c0e-a24a-febad942156f"
        };

        const result = await useCase.execute(request);

        expect(result.newProject.title).toBe("Test Project No Extension");
        expect(result.newProject.partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f");
        expect(result.newProject.extensionHours).toBeUndefined();
        expect(result.partnerName).toBe("Poliedro");
    });

    it("should throw BadRequestException if partner does not exist", async () => {
        try {
            const request = {
                title: "Invalid Partner Project",
                partnerId: "334478f6-a764-4c0e-a24a-febad942157u",
                extensionHours: 5
            };
            await useCase.execute(request);
        }
        catch (error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("O parceiro selecionado não está no banco");
            expect(error.statusCode).toBe(400);
        }
    });
});