import { UpdateGroupRequest } from "app/modules/group/update_group/update_group_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest"

describe("UpdateGroupSchema -Zod validation", () => {
    it("should pass the zod validation, updating every attribute", () => {
        expect(parseBody(UpdateGroupRequest, {
            id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            codSubj: "CS101",
            userIdList: ["574478f6-a764-4c0e-a24a-febad942156f", "e9c7d747-9e8e-4d34-935e-473c2c16be83"],
            yearSem: 20231,
            projectId: "123e4567-e89b-12d3-a456-426614174000",
            course: "CIÊNCIAS DA COMPUTAÇÃO"
        })).toEqual({
            id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            codSubj: "CS101",
            userIdList: ["574478f6-a764-4c0e-a24a-febad942156f", "e9c7d747-9e8e-4d34-935e-473c2c16be83"],
            yearSem: 20231,
            projectId: "123e4567-e89b-12d3-a456-426614174000",
            course: "CIÊNCIAS DA COMPUTAÇÃO"
        });
    });

    it("should pass the zod validation, updating only codSubj", () => {
        expect(parseBody(UpdateGroupRequest, {
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            codSubj: "CS102"
        })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            codSubj: "CS102"
        });
    });

    it("should pass the zod validation, updating only userIdList", () => {
        expect(parseBody(UpdateGroupRequest, {
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            userIdList: ["574478f6-a764-4c0e-a24a-febad942156f"]
        })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            userIdList: ["574478f6-a764-4c0e-a24a-febad942156f"]
        });
    });

    it("should pass the zod validation, updating only yearSem", () => {
        expect(parseBody(UpdateGroupRequest, {
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            yearSem: 20232
        })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            yearSem: 20232
        });
    });

    it("should pass the zod validation, updating only projectId", () => {
        expect(parseBody(UpdateGroupRequest, {
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            projectId: "123e4567-e89b-12d3-a456-426614174000"
        })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            projectId: "123e4567-e89b-12d3-a456-426614174000"
        });
    });

    it("should pass the zod validation, updating only course", () => {
        expect(parseBody(UpdateGroupRequest, {
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            course: "SISTEMAS DE INFORMAÇÃO"
        })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            course: "SISTEMAS DE INFORMAÇÃO"
        });
    });

    it("should throw (O id deve ser dado em string) if id is not a string", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: 123456789012345678901234567890123456,
                codSubj: "CS102"
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O id deve conter 36 caracteres) if id has less than 36 characters", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be8",
                codSubj: "CS102"
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O userId deve ser dado em string) if userIdList contains a non-string id", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                userIdList: ["574478f6-a764-4c0e-a24a-febad942156f", 123456789012345678901234567890123456]
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O userId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O codSubj deve ser dado em string) if codSubj is not a string", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                codSubj: 101
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O codSubj deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O userIdList deve ser um array) if userIdList is not an array", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                userIdList: "574478f6-a764-4c0e-a24a-febad942156f"
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O userIdList deve ser um array")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O userId deve conter 36 caracteres) if userIdList contains an id with less than 36 characters", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                userIdList: ["574478f6-a764-4c0e-a24a-febad942156f", "e9c7d747-9e8e-4d34-935e-473c2c16be8"]
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O userId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (A lista de usuários deve conter ao menos um id de usuário) if userIdList is empty", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                userIdList: []
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O userIdList deve conter ao menos um id de usuário")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O yearSem deve ser dadas em numero) if yearSem is not a number", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                yearSem: "20231"
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O yearSem deve ser dadas em numero")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O yearSem deve ser maior que 0) if yearSem is less than 1", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                yearSem: 0
            })
        }
        catch (error: any) { 
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O yearSem deve ser maior que 0")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O projectId deve ser dado em string) if projectId is not a string", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                projectId: 123456789012345678901234567890123456
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O projectId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O projectId deve conter 36 caracteres) if projectId has less than 36 characters", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                projectId: "123e4567-e89b-12d3-a456-42661417400"
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O projectId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (course não está entre os disponíveis) if course is not in the enum", () => {
        try {
            parseBody(UpdateGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                course: "MEDICINA"
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("course não está entre os disponíveis")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve passar algum atributo para ser alterado) if no attribute is provided to be updated", () => {
        try {
            parseBody(UpdateGroupRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve passar algum atributo para ser alterado")
            expect(error.statusCode).toBe(400)
        }
    });
});