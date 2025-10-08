import { GetUserRequest } from "../../../../app/modules/user/get_user/get_user_schema";
import { parseBody } from "../../../../app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("GetUserSchema -Zod validation", () => {

    it("should pass the zod validation, for id", () =>{
        expect(parseBody(GetUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"})).toEqual({
             id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"});
    });

    it("should pass the zod validation, for email", () =>{
        expect(parseBody(GetUserRequest, {email: "zidane@realmadrid.com.es"})).toEqual({
             email: "zidane@realmadrid.com.es"
        });
    });

    it("should throw (O id deve conter 36 caracteres) if id has less than 36 characters", () =>{
        try {
            parseBody(GetUserRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa637"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Endereço de e-mail inválido) if email is not valid", () =>{
        try {
            parseBody(GetUserRequest, {email: "zidane.com.es"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Endereço de e-mail inválido")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve informar o id ou o email (exatamente um)) if id and email are provided", () =>{
        try {
            parseBody(GetUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", email: "zidane@realmadrid.com.es"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar o id ou o email (exatamente um)")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve informar o id ou o email (exatamente um)) if neither id nor email are provided", () =>{
        try {
            parseBody(GetUserRequest, {})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar o id ou o email (exatamente um)")
            expect(error.statusCode).toBe(400)
        }
    });
});