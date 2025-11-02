import { GetPartnerUseCase } from "app/modules/partner/get_partner/get_partner_usecase";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock"
import { describe, it, expect, beforeEach } from "vitest"

describe("GetUserUsecase", () => {
    let partner: PartnerRepoMock
    let usecase: GetPartnerUseCase

    beforeEach(() => {
        partner = new PartnerRepoMock();
        usecase = new GetPartnerUseCase(partner);
    });

    it("should get the partner by id in repository mock and return it", async () => {
        const result = await usecase.execute({ id: "574478f6-a764-4c0e-a24a-febad942156f" })

        expect(result.partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f")
        expect(result.name).toBe("Poliedro")
        expect(result.sector).toBe("EDUCACIONAL")
    });

    it("should get the partner by name in repository mock and return it", async () => {
        const result = await usecase.execute({ name: "Poliedro" })

        expect(result.partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f")
        expect(result.name).toBe("Poliedro")
        expect(result.sector).toBe("EDUCACIONAL")
    });

    it("should throw (Parceiro não está no banco) if id doesn't exist", async () => {
        try {
            await usecase.execute({ id: "574478f6-a764-4c0e-a24a-febad9421567" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Parceiro não está no banco")
            expect(error.statusCode).toBe(404)
        }
    });
});