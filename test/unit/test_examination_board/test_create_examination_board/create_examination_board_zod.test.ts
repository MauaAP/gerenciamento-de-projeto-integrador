import { CreateExaminationBoardRequest } from "app/modules/examination_board/create_examination_board/create_examination_board_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest";

describe("CreateExaminationBoardUseCase - Zod validation", () => {
    it("should pass the validation with correct data", () => {
        const result = parseBody(CreateExaminationBoardRequest, {
            professorIdList: [
                "f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389",
                "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4",
                "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7"
            ],
        });
        expect(result.professorIdList).toEqual([
            "f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389",
            "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4",
            "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7"
        ]);
    });

    it("should throw BadRequestException if professorIdList is missing", () => {
        try {
            parseBody(CreateExaminationBoardRequest, {});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A lista de professores é obrigatório")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if professorIdList is empty", () => {
        try {
            parseBody(CreateExaminationBoardRequest, { professorIdList: [] });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A lista de professores deve conter ao menos um id de professor")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if professorIdList has an id that is not a string", () => {
        try {
            parseBody(CreateExaminationBoardRequest, { professorIdList: [123] });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O professorId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if professorIdList has an id that is not 36 characters", () => {
        try {
            parseBody(CreateExaminationBoardRequest, { professorIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0c"] });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O professorId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });
});   