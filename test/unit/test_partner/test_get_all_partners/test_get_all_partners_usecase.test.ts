import { GetAllPartnersUseCase } from "app/modules/partner/get_all_partners/get_all_partners_usecase";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdatePartnerUsecCase", () => {
    let useCase: GetAllPartnersUseCase;
    let partnerRepo: PartnerRepoMock;

    beforeEach(() => {
        partnerRepo = new PartnerRepoMock();
        useCase = new GetAllPartnersUseCase(partnerRepo);
    });

    it("should return all partners in repository mock", async () => {
        const result = await useCase.execute();

        expect(result.length).toBe(7);
        expect(result[0].partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f");
        expect(result[0].name).toBe("Poliedro");
        expect(result[0].sector).toBe("EDUCACIONAL");
    });
});