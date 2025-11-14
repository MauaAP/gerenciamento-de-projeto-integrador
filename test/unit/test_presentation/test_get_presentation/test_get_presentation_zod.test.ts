import { GetPresentationRequest } from "app/modules/presentation/get_presentation/get_presentation_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest";

describe("GetPresentationUseCase - Zod validation", () => {
    it("should pass the validation for id", () => {
        const result = parseBody(GetPresentationRequest, {
            id: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
        });
        expect(result.id).toBe("14e97d3c-d309-43d4-bfa0-7724e1e54fb2");
    });

    it("should pass the validation for date filter", () => {
        const result = parseBody(GetPresentationRequest, {
            date: 1750854600000,
            groupId: "3896e005-bc5c-4839-a43b-463ae9c3583c",
            examinationBoardId: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b",
        });
        expect(result.date).toBe(1750854600000);
        expect(result.groupId).toBe("3896e005-bc5c-4839-a43b-463ae9c3583c");
        expect(result.examinationBoardId).toBe("d7e6218a-001b-4fd6-9d97-ddf985f6ab5b");
    });

    it("should throw BadRequestException if neither id nor date filter is provided", () => {
        try {
            parseBody(GetPresentationRequest, {});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar id ou filtros (exatemente um)")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if both id and date filter are provided", () => {
        try {
            parseBody(GetPresentationRequest, {
                id: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
                date: 1750854600000,
                groupId: "3896e005-bc5c-4839-a43b-463ae9c3583c",
                examinationBoardId: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b",
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar id ou filtros (exatemente um)")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if id is not a string", () => {
        try {
            parseBody(GetPresentationRequest, {
                id: 12345,
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if id is not 36 characters", () => {
        try {
            parseBody(GetPresentationRequest, {
                id: "short-id",
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if date is not a number", () => {
        try {
            parseBody(GetPresentationRequest, {
                date: "not-a-number"
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("date deve ser dada em numero")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if groupId is not a string", () => {
        try {
            parseBody(GetPresentationRequest, {
                date: 1750854600000,
                groupId: 12345,
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("groupId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if groupId is not 36 characters", () => {
        try {
            parseBody(GetPresentationRequest, {
                date: 1750854600000,
                groupId: "short-group-id",
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O group id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if examinationBoartId is not a string", () => {
        try {
            parseBody(GetPresentationRequest, {
                date: 1750854600000,
                groupId: "3896e005-bc5c-4839-a43b-463ae9c3583c",
                examinationBoardId: 12345,
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("examinationBoardId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if examinationBoartId is not 36 characters", () => {
        try {
            parseBody(GetPresentationRequest, {
                date: 1750854600000,
                groupId: "3896e005-bc5c-4839-a43b-463ae9c3583c",
                examinationBoardId: "short-examination-board-id",
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O examinationBoart id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });
});