import { GetUserRequest } from "../../../modules/user/get_user/get_user_schema";
import { parseBody } from "../../../shared/utils/parse_body";
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

    it("should throw (O id deve conter 36 caractéres) if id has less than 36 characters", () =>{
        expect(() => parseBody(GetUserRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa637"})).toThrow("O id deve conter 36 caractéres");
    });

    it("should throw (Endereço de e-mail inválido) if email is not valid", () =>{
        expect(() => parseBody(GetUserRequest, {email: "zidane.com.es"})).toThrow("Endereço de e-mail inválido");
    });

    it("should throw (Você deve informar o id ou o email (exatamente um)) if id and email are provided", () =>{
        expect(() => parseBody(GetUserRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", email: "zidane@realmadrid.com.es"})).toThrow("Você deve informar o id ou o email (exatamente um)");
    });

    it("should throw (Você deve informar o id ou o email (exatamente um)) if neither id nor email are provided", () =>{
        expect(() => parseBody(GetUserRequest, {})).toThrow("Você deve informar o id ou o email (exatamente um)");
    });
})