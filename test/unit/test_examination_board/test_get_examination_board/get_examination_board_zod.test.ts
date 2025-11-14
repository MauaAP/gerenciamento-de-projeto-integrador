import { GetExaminationBoardRequest } from "app/modules/examination_board/get_examination_board/get_examination_board_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest";

describe("GetExaminationBoardUseCase - Zod validation", () => {
    it("should pass the validation for id", () => {
        const result = parseBody(GetExaminationBoardRequest, {
            id: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b",
        });
        expect(result.id).toBe("d7e6218a-001b-4fd6-9d97-ddf985f6ab5b");
    });

    it("should pass the validation for professorId", () => {
        const result = parseBody(GetExaminationBoardRequest, {
            professorId: "a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3",
        });
        expect(result.professorId).toBe("a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3");
    });

    it("should throw BadRequestException if neither id nor professorId is provided", () => {
        try {
            parseBody(GetExaminationBoardRequest, {});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar o id ou o professorId (exatamente um)")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if both id and professorId are provided", () => {
        try {
            parseBody(GetExaminationBoardRequest, {
                id: "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b",
                professorId: "a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3",
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Você deve informar o id ou o professorId (exatamente um)")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if id is not a string", () => {
        try {
            parseBody(GetExaminationBoardRequest, {
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
            parseBody(GetExaminationBoardRequest, {
                id: "d7e6218a-001b-4fd6-9d97-ddf985f6ab",
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if professorId is not a string", () => {
        try {
            parseBody(GetExaminationBoardRequest, {
                professorId: 12345,
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O professor id deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if professorId is not 36 characters", () => {
        try {
            parseBody(GetExaminationBoardRequest, {
                professorId: "a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d",
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O professor id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });
});