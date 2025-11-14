
import { UpdateUserRequest } from "app/modules/user/update_user/update_user_schema";
import { parseBody } from "../../../../app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";
import { BadRequestException } from "app/shared/helpers/exceptions";

describe("UpdateUserSchema -Zod validation", () => {

    it("should pass the zod validation, updating every attribute", () =>{
        expect(parseBody(UpdateUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "John", email: "john06@gmail.com", role: "ADMIN", password: "1234567A"})).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "John", email: "john06@gmail.com", role: "ADMIN", password: "1234567A" });
    });

    it("should pass the zod validation, updating only name", () => {
        expect(parseBody(UpdateUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "John"})).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", name: "John" });
    });

    it ("should pass the zod validation, updating only email", () => {
        expect(parseBody(UpdateUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", email: "superhomem@gmail.com"})).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", email: "superhomem@gmail.com" });
    });

    it ("should pass the zod validation, updating only role", () => {
        expect(parseBody(UpdateUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", role: "ADMIN"})).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", role: "ADMIN" });
    });
    // aqui acho legal citar que a validação para que um usuário não possa se tornar admin se ele for moderator foi feita no controller

    it ("should pass the zod validation, updating only password", () => {
        expect(parseBody(UpdateUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", password: "1234567A"})).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", password: "1234567A" });
    })

    it("should throw (O id deve conter 36 caracteres) if id has less than 36 characters", () =>{
        try {
            parseBody(UpdateUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be8", name: "John"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve passar algum atributo para ser alterado) if no attribute is provided to be updated", () =>{
        try {
            parseBody(UpdateUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve passar algum atributo para ser alterado")
            expect(error.statusCode).toBe(400)
        }
    });
})