import { UpdatePartnerUseCase } from "app/modules/partner/update_partner/update_partner_usecase"
import { SECTOR } from "app/shared/domain/enums/sector";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock"
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdateUserUsecase", () => {
    let partnerRepo: PartnerRepoMock
    let partnerUseCase: UpdatePartnerUseCase

    beforeEach(() => {
        partnerRepo = new PartnerRepoMock();
        partnerUseCase = new UpdatePartnerUseCase(partnerRepo);
    })

    it("should update the partner in repository mock and return it", async () => {
        const result = await partnerUseCase.execute({ id: "574478f6-a764-4c0e-a24a-febad942156f", updateOptions: { name: "Partner Teste", sector: SECTOR.FINANCIAL } })

        expect(result.partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f")
        expect(result.name).toBe("Partner Teste")
        expect(result.sector).toBe("FINANCEIRO")
    });

    it("should update only the name of the partner in repository mock and return it", async () => {
        const result = await partnerUseCase.execute({ id: "574478f6-a764-4c0e-a24a-febad942156f", updateOptions: { name: "Partner Teste"}})

        expect(result.partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f")
        expect(result.name).toBe("Partner Teste")
        expect(result.sector).toBe("EDUCACIONAL")
    });

    it("should update only the sector of the partner in repository mock and return it", async () => {
        const result = await partnerUseCase.execute({ id: "574478f6-a764-4c0e-a24a-febad942156f", updateOptions: { sector: SECTOR.FINANCIAL}})

        expect(result.partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f")
        expect(result.name).toBe("Poliedro")
        expect(result.sector).toBe("FINANCEIRO")
    });

    it("should throw NotFoundException if id doesn't exist", async () => {
        try {
        
            await partnerUseCase.execute({ id: "574478f6-a764-4c0e-a24a-febad9421567", updateOptions: { name: "Partner Teste" }});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Usuário não está no banco")
        }
    });
});