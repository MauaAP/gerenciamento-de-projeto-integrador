import { GetProjectUseCase } from "app/modules/project/get_project/get_project_usecase";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("GetProjectUsecase", () => {
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let useCase: GetProjectUseCase;
    
    beforeEach(() => {
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        useCase = new GetProjectUseCase(projectRepo, partnerRepo);
    });

    it("should get the project by id in repository mock and return it, with the partnerName", async () => {
        const result = await useCase.execute({ id: "81617d7c-662f-4fbc-803f-2cae90f5252f" })

        expect(result[0].projectId).toBe("81617d7c-662f-4fbc-803f-2cae90f5252f")
        expect(result[0].title).toBe("Criação de imagem do Poliedro")
        expect(result[0].extensionHours).toBe(undefined)
        expect(result[0].partnerName).toBe("Poliedro")
    });

    it("should get the project by partnerId in repository mock and return it, with the partnerName", async () => {
        const result = await useCase.execute({ partnerId: "574478f6-a764-4c0e-a24a-febad942156f" })

        expect(result.length).toBe(2)

        expect(result[0].projectId).toBe("81617d7c-662f-4fbc-803f-2cae90f5252f")
        expect(result[0].title).toBe("Criação de imagem do Poliedro")
        expect(result[0].extensionHours).toBe(undefined)
        expect(result[0].partnerName).toBe("Poliedro")
        
        expect(result[1].projectId).toBe("805c6a8a-450e-414f-a257-bc8979d31f34")
        expect(result[1].title).toBe("Show do milhão poliedro")
        expect(result[1].extensionHours).toBe(216000)
        expect(result[1].partnerName).toBe("Poliedro")
    });

    it("should throw (Nenhum projeto encontrado) if id doesn't exist", async () => {
        try {
            await useCase.execute({ id: "81617d7c-662f-4fbc-803f-2cae90f5252" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Nenhum projeto encontrado")
            expect(error.statusCode).toBe(404)
        }
    });

    it("should throw (Nenhum projeto encontrado) if partnerId doesn't exist", async () => {
        try {
            await useCase.execute({ partnerId: "574478f6-a764-4c0e-a24a-febad942156" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Nenhum projeto encontrado")
            expect(error.statusCode).toBe(404)
        }
    });
});