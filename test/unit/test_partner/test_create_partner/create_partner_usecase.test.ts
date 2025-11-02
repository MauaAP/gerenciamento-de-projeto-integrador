import { CreatePartnerUseCase } from "app/modules/partner/create_partner/create_partner_usecase";
import { SECTOR } from "app/shared/domain/enums/sector";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { describe, it, expect, should, beforeEach } from "vitest";

describe("CreatePartnerUseCase", () =>{
    let partnerRepo: PartnerRepoMock;
    let usecase: CreatePartnerUseCase;

    beforeEach(() => {
        partnerRepo = new PartnerRepoMock();
        usecase = new CreatePartnerUseCase(partnerRepo);
    });

    it("should create a new partner and return partner", async () => {
        const request = {
            name: "Teste Partner",
            sector: SECTOR.INDUSTRIAL
        }

        const result = await usecase.execute(request);
        expect(result.name).toBe("Teste Partner");
        expect(result.sector).toBe(SECTOR.INDUSTRIAL);
    });

    it ("should throw BadRequestException if partner name already exists", async () => {
        try {
            const request = {
                name: "Poliedro",
                sector: SECTOR.EDUCATIONAL
            }

            await usecase.execute(request);
        }
        catch (error: any) {
            expect(error.name).toBe("BadRequestException");
            expect(error.message).toBe("Parceiro já cadastrado");
            expect(error.statusCode).toBe(400);
        }
    });
});