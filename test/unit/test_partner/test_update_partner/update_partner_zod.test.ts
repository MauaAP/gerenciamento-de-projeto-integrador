import { UpdatePartnerRequest } from "app/modules/partner/update_partner/update_partner_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdatePartnerSchema -Zod validation", () => {
    it("should pass the zod validation, updating every attribute", () => {
        expect(parseBody(UpdatePartnerRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "Partner A", sector: "EDUCACIONAL" })).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "Partner A", sector: "EDUCACIONAL" });
    });

    it("should pass the zod validation, updating only name", () => {
        expect(parseBody(UpdatePartnerRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "Partner A" })).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "Partner A" });
    });

    it("should pass the zod validation, updating only sector", () => {
        expect(parseBody(UpdatePartnerRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", sector: "EDUCACIONAL" })).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", sector: "EDUCACIONAL" });
    });

    it("should throw (O id deve conter 36 caracteres) if id has less than 36 characters", () => {
        try {
            parseBody(UpdatePartnerRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be8", name: "Partner A" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve passar algum atributo para ser alterado) if no attribute is provided to be updated", () => {
        try {
            parseBody(UpdatePartnerRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve passar algum atributo para ser alterado")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Sector não está entre os disponíveis) if sector is not among the available ones", () => {
        try {
            parseBody(UpdatePartnerRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", sector: "INVALIDO" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Sector selecionado não está entre os disponíveis")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Name deve ter pelo menos um caracter) if name is an empty string", () => {
        try {
            parseBody(UpdatePartnerRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Name deve ter pelo menos um caracter")
            expect(error.statusCode).toBe(400)
        }
    });
});