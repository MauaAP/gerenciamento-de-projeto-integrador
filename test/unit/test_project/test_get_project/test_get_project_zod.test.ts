import { GetProjectRequest } from "app/modules/project/get_project/get_project_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("GetProjectSchema -Zod validation", () => {
    it("should pass the zod validation, for id", () =>{
        expect(parseBody(GetProjectRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"})).toEqual({
             id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"});
    });

    it("should pass the zod validation, for partnerId", () =>{
        expect(parseBody(GetProjectRequest, {partnerId: "574478f6-a764-4c0e-a24a-febad942156f"})).toEqual({partnerId: "574478f6-a764-4c0e-a24a-febad942156f"});
    });

    it("should throw (O id deve conter 36 caracteres) if id has less than 36 characters", () =>{
        try {
            parseBody(GetProjectRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa637"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O partnerId deve conter 36 caracteres) if partnerId has less than 36 characters", () =>{
        try {
            parseBody(GetProjectRequest, {partnerId: "574478f6-a764-4c0e-a24a-febad94215"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O partnerId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    

    it("should throw (Você deve informar o id ou o partnerId (exatamente um)) if id and partnerId are provided", () =>{
        try {
            parseBody(GetProjectRequest, {id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", partnerId: "574478f6-a764-4c0e-a24a-febad942156f"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar o id ou o partnerId (exatamente um)")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve informar o id ou o partnerId (exatamente um)) if neither id nor partnerId are provided", () =>{
        try {
            parseBody(GetProjectRequest, {})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar o id ou o partnerId (exatamente um)")
            expect(error.statusCode).toBe(400)
        }
    });
});