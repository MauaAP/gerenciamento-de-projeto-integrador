import { DeletePartnerUseCase } from "app/modules/partner/delete_partner/delete_partner_usecase";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("DeletePartnerUsecase", () =>{
    let partnerRepo: PartnerRepoMock
    let usecase: DeletePartnerUseCase

    beforeEach(() =>{
        partnerRepo= new PartnerRepoMock();
        usecase= new DeletePartnerUseCase(partnerRepo);
    });

    it("should delete the partner from repository mock and return it", async () => {
        const result= await usecase.execute({id: "574478f6-a764-4c0e-a24a-febad942156f"})

        expect(result.partnerId).toBe("574478f6-a764-4c0e-a24a-febad942156f")
        expect(result.name).toBe("Poliedro")
        expect(result.sector).toBe("EDUCACIONAL")
    });

    it("should throw NotFoundException if id doesnt's exist", async () =>{
        try {
            await usecase.execute({id: "574478f6-a764-4c0e-a24a-febad942156"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Parceiro não está no banco")
            expect(error.statusCode).toBe(404)
        }
    });
});