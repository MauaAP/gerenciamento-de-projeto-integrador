import { UpdatePresentationRequest } from "app/modules/presentation/update_presentation/update_presentation_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest"

describe("UpdatePresentationSchema -Zod validation", () => {
    it("should pass the zod validation, updating every attribute", () => {
        expect(parseBody(UpdatePresentationRequest, {
            id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            date: 1672531199000,
            groupId: "123e4567-e89b-12d3-a456-426614174000",
            examinationBoartId: "987e6543-e21b-12d3-a456-426614174000"
        })).toEqual({
            id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            date: 1672531199000,
            groupId: "123e4567-e89b-12d3-a456-426614174000",
            examinationBoartId: "987e6543-e21b-12d3-a456-426614174000"
        });
    })

    it("should pass the zod validation, updating only date", () => {
        expect(parseBody(UpdatePresentationRequest, {
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            date: 1672531199000
        })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            date: 1672531199000
        });
    })

    it("should pass the zod validation, updating only groupId", () => {
        expect(parseBody(UpdatePresentationRequest, {
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            groupId: "123e4567-e89b-12d3-a456-426614174000"
        })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            groupId: "123e4567-e89b-12d3-a456-426614174000"
        });
    });

    it("should pass the zod validation, updating only examinationBoartId", () => {
        expect(parseBody(UpdatePresentationRequest, {
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            examinationBoartId: "987e6543-e21b-12d3-a456-426614174000"
        })).toEqual({
            id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
            examinationBoartId: "987e6543-e21b-12d3-a456-426614174000"
        });
    });

    it("should throw (Você deve passar algum atributo para ser alterado) when no attribute to update is given", () => {
        try {
            parseBody(UpdatePresentationRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83"
            });
        } catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve passar algum atributo para ser alterado");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should throw (O id deve ser dado em string) if id is not a string", () => {
        try {
            parseBody(UpdatePresentationRequest, {
                id: 123456789012345678901234567890123456,
                date: 1672531199000
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O id deve conter 36 caracteres) if id length is different from 36", () => {
        try {
            parseBody(UpdatePresentationRequest, {
                id: "123e4567-e89b",
                date: 1672531199000
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (date deve ser dada em numero) if date is not a number", () => {
        try {
            parseBody(UpdatePresentationRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                date: "1672531199000"
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("date deve ser dada em numero")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O groupId deve ser dado em string) if groupId is not a string", () => {
        try {
            parseBody(UpdatePresentationRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                groupId: 123456789012345678901234567890123456
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("groupId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O group id deve conter 36 caracteres) if groupId has less than 36 characters", () => {
        try {
            parseBody(UpdatePresentationRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                groupId: "123e4567-e89b-12d3-a456"
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O group id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O examinationBoartId deve ser dado em string) if examinationBoartId is not a string", () => {
        try {
            parseBody(UpdatePresentationRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                examinationBoartId: 123456789012345678901234567890123456
            } as any)
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("examinationBoardId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (O examinationBoart id deve conter 36 caracteres) if examinationBoartId has less than 36 characters", () => {
        try {
            parseBody(UpdatePresentationRequest, {
                id: "e9c7d747-9e8e-4d34-935e-473c2c16be83",
                examinationBoartId: "987e6543-e21b-12d3"
            })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O examinationBoard id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });
});