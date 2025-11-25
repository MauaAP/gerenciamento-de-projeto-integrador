import { CreatePresentationRequest } from "app/modules/presentation/create_presentation/create_presentation_schema";
import { parseBody } from "app/shared/utils/parse_body";
import e from "express";
import { describe, it, expect } from "vitest";

describe("CreatePresentationSchema - Zod validation", () => {
    it("should pass the zod validation", () => {
        expect(parseBody(CreatePresentationRequest, {
            date: 1750854600000,
            groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
            examinationBoardId: "3896e005-bc5c-4839-a43b-463ae9c3583c"
        })).toEqual({
            date: 1750854600000,
            groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
            examinationBoardId: "3896e005-bc5c-4839-a43b-463ae9c3583c"
        });
    });

    it("should throw BadRequestException if date is missing", () => {
        try {
            parseBody(CreatePresentationRequest, {
                groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
                examinationBoardId: "3896e005-bc5c-4839-a43b-463ae9c3583c"
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A data deve ser data em numero")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if date is not number", () => {
        try {
            parseBody(CreatePresentationRequest, {
                date: "1750854600000",
                groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
                examinationBoardId: "3896e005-bc5c-4839-a43b-463ae9c3583c"
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A data deve ser data em numero")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if groupId is not string", () => {
        try {
            parseBody(CreatePresentationRequest, {
                date: 1750854600000,
                groupId: 123,
                examinationBoardId: "3896e005-bc5c-4839-a43b-463ae9c3583c"
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O groupId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if groupId is not 36 characters", () => {
        try {
            parseBody(CreatePresentationRequest, {
                date: 1750854600000,
                groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb",
                examinationBoardId: "3896e005-bc5c-4839-a43b-463ae9c3583c"
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O groupId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if examinationBoardId is not string", () => {
        try {
            parseBody(CreatePresentationRequest, {
                date: 1750854600000,
                groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
                examinationBoardId: 456
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O examinationBoardId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if examinationBoardId is not 36 characters", () => {
        try {
            parseBody(CreatePresentationRequest, {
                date: 1750854600000,
                groupId: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
                examinationBoardId: "3896e005-bc5c-4839-a43b-463ae9c3583"
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O examinationBoardId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });
});