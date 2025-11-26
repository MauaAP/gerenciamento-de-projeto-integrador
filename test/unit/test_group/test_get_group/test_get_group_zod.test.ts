import { GetGroupRequest } from "app/modules/group/get_group/get_group_schema";
import { COURSE } from "app/shared/domain/enums/course";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("GetGroupSchema -Zod validation", () => {
    it("should pass the zod validation, for id", () => {
        expect(parseBody(GetGroupRequest, { id: "e9c7d747-9e8e-4d34-935e-473c2c16be83" })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"
        });
    });

    it("should throw (O id deve conter 36 caracteres) if id has less than 36 characters", () => {
        try {
            parseBody(GetGroupRequest, { id: "7a181d51-4f96-4d97-81b9-16e08aa637" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should pass the zod validation, for userId, codSubj, yearSem, projectId and course", () => {
        expect(parseBody(GetGroupRequest, {
            userId: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            codSubj: "MAT101",
            yearSem: 202501,
            projectId: "574478f6-a764-4c0e-a24a-febad942156f",
            course: COURSE.SIN
        }))
    });

    it("should throw (O user id deve conter 36 caracteres) if userId has less than 36 characters", () => {
        try {
            parseBody(GetGroupRequest, { userId: "7a181d51-4f96-4d97-81b9-16e08aa637" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O user id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O yearSem deve ser dadas em numero) if yearSem is not a number", () => {
        try {
            parseBody(GetGroupRequest, { yearSem: "202501" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O yearSem deve ser dadas em numero")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O yearSem deve ser maior que 0) if yearSem is less than 1", () => {
        try {
            parseBody(GetGroupRequest, { yearSem: 0 })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O yearSem deve ser maior que 0")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O projectId deve conter 36 caracteres) if projectId has less than 36 characters", () => {
        try {
            parseBody(GetGroupRequest, { projectId: "574478f6-a764-4c0e-a24a-febad94215" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O projectId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (course deve ser dado no enum COURSE) if course is not in enum COURSE", () => {
        try {
            parseBody(GetGroupRequest, { course: "CIC" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar id ou filtros (exatemente um))")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve informar id ou filtros (exatemente um)) if id and filters are provided", () => {
        try {
            parseBody(GetGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                userId: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                codSubj: "MAT101",
                yearSem: 202501,
                projectId: "574478f6-a764-4c0e-a24a-febad942156f",
                course: COURSE.SIN
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar id ou filtros (exatemente um))")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve informar id ou filtros (exatemente um)) if id and some filters are provided", () => {
        try {
            parseBody(GetGroupRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                userId: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                codSubj: "MAT101"
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar id ou filtros (exatemente um))")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (Você deve informar id ou filtros (exatemente um)) if neither id nor filters are provided", () => {
        try {
            parseBody(GetGroupRequest, {})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar id ou filtros (exatemente um))")
            expect(error.statusCode).toBe(400)
        }
    });
});