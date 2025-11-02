
import { UpdateProjectRequest } from "app/modules/project/update_project/update_project_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest"

describe("UpdateProjectSchema -Zod validation", () => {
    it("should pass the zod validation, updating every attribute", () => {
        expect(parseBody(UpdateProjectRequest, { id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", title: "Project Teste", partnerId: "574478f6-a764-4c0e-a24a-febad942156f", extensionHours: 100 })).toEqual({ id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", title: "Project Teste", partnerId: "574478f6-a764-4c0e-a24a-febad942156f", extensionHours: 100 });
    });

    it("should pass the zod validation, updating only title", () => {
        expect(parseBody(UpdateProjectRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", title: "Project A" })).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", title: "Project A" });
    });

    it("should pass the zod validation, updating only partnerId", () => {
        expect(parseBody(UpdateProjectRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", partnerId: "574478f6-a764-4c0e-a24a-febad942156f" })).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", partnerId: "574478f6-a764-4c0e-a24a-febad942156f" });
    });

    it("should pass the zod validation, updating only extensionHours", () => {
        expect(parseBody(UpdateProjectRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", extensionHours: 100 })).toEqual({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", extensionHours: 100 });
    });

    it("should throw (O id deve conter 36 caracteres) if id has less than 36 characters", () => {
        try {
            parseBody(UpdateProjectRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be8", title: "Project A" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O title deve conter pelo menos 6 caracteres) if title has less than 6 characters", () => {
        try {
            parseBody(UpdateProjectRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", title: "Proj" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O title deve conter pelo menos 6 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (As extensionHours devem ser dadas em numero de horas (number)) if extensionHours is not a number", () => {
        try {
            parseBody(UpdateProjectRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", extensionHours: "cem" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("As extensionHours devem ser dadas em numero de horas (number)")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O numero de extensionHours deve ser maior que 0) if extensionHours is a negative number", () => {
        try {
            parseBody(UpdateProjectRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", extensionHours: -5 })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O numero de extensionHours deve ser maior que 0")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve passar algum atributo para ser alterado) if no attribute is provided to be updated", () => {
        try {
            parseBody(UpdateProjectRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve passar algum atributo para ser alterado")
            expect(error.statusCode).toBe(400)
        }
    });
});