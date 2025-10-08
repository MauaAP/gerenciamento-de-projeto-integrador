import { GetPartnerRequest } from "app/modules/partner/get_partner/get_partner_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("GetPartnerSchema -Zod validation", () => {

    it("should pass the zod validation, for id", () =>{
        expect(parseBody(GetPartnerRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"})).toEqual({
             id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"});
    });

    it("should pass the zod validation, for name", () =>{
        expect(parseBody(GetPartnerRequest, {name: "Real Madrid"})).toEqual({name: "Real Madrid"});
    });

    it("should throw (O id deve conter 36 caracteres) if id has less than 36 characters", () =>{
        try {
            parseBody(GetPartnerRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa637"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O nome deve conter no mínimo 1 caracter) if name has less than 1 character", () =>{
        try {
            parseBody(GetPartnerRequest, {name: ""})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O nome deve conter no mínimo 1 caracter")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve informar o id ou o nome (exatamente um)) if id and name are provided", () =>{
        try {
            parseBody(GetPartnerRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "Real Madrid"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar o id ou o nome (exatamente um)")
            expect(error.statusCode).toBe(400)
        }
    });
    
    it("should throw (Você deve informar o id ou o nome (exatamente um)) if neither id nor name are provided", () =>{
        try {
            parseBody(GetPartnerRequest, {})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar o id ou o nome (exatamente um)")
            expect(error.statusCode).toBe(400)
        }
    });
});