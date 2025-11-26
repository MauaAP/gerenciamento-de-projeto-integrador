import { CreatePartnerRequest } from "app/modules/partner/create_partner/create_partner_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest";

describe("CreatePartnerUseCase - Zod validation", () => {
    it("should throw BadRequestException if name is missing", () => {
        try {
            parseBody(CreatePartnerRequest, { sector: "INDUSTRIAL" });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Name é obrigatório")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if sector is missing", () => {
        try {
            parseBody(CreatePartnerRequest, { name: "Partner" });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Sector é obrigatório. Valores aceitos: EDUCACIONAL, GOVERNAMENTAL, INDUSTRIAL, SAÚDE, ONG, AMBIENTAL, FINANCEIRO")
            expect(error.statusCode).toBe(400)
        }
    });
});