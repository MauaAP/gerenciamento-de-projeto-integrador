import { UpdateExaminationBoardRequest } from "app/modules/examination_board/update_examination_board/update_examination_board_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { parse } from "path";
import { describe, it, expect } from "vitest"

describe("UpdateExaminationBoardSchema -Zod validation", () => {
    it("should pass the zod validation, updating every attribute", () => {
        expect(parseBody(UpdateExaminationBoardRequest, {
            id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            newProfessorIdList: ["574478f6-a764-4c0e-a24a-febad942156f", "e9c7d747-9e8e-4d34-935e-473c2c16be83"],
        })).toEqual({
            id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            newProfessorIdList: ["574478f6-a764-4c0e-a24a-febad942156f", "e9c7d747-9e8e-4d34-935e-473c2c16be83"],
        });
    });

    it("should fail the zod validation, missing newProfessorIdList", () => {
        try {
            parseBody(UpdateExaminationBoardRequest, {
                id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A lista de professores é obrigatório");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should fail the zod validation, empty newProfessorIdList", () => {
        try {
            parseBody(UpdateExaminationBoardRequest, {
                id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
                newProfessorIdList: [],
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A lista de professores deve conter ao menos um id de professor");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should fail the zod validation, invalid id length", () => {
        try {
            parseBody(UpdateExaminationBoardRequest, {
                id: "470f1e7b-f645-4da6-9b59",
                newProfessorIdList: ["574478f6-a764-4c0e-a24a-febad942156f"],
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should fail the zod validation, invalid id type", () => {
        try {
            parseBody(UpdateExaminationBoardRequest, {
                id: 12345,
                newProfessorIdList: ["574478f6-a764-4c0e-a24a-febad942156f"],
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve ser dado em string");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should fail the zod validation, invalid professorId length", () => {
        try {
            parseBody(UpdateExaminationBoardRequest, {
                id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
                newProfessorIdList: ["574478f6-a764-4c0e-a24a-febad94215"],
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O professorId deve conter 36 caracteres");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should fail the zod validation, invalid professorId type", () => {
        try {
            parseBody(UpdateExaminationBoardRequest, {
                id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
                newProfessorIdList: [12345],
            });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O professorId deve ser dado em string");
            expect(error.statusCode).toBe(400);
        }
    });

    it("should fail the zod validation, newProfessorIdList not an array", () => {
        try {
            parseBody(UpdateExaminationBoardRequest, {
                id: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf",
                newProfessorIdList: "574478f6-a764-4c0e-a24a-febad942156f",
            } as any);
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A lista de professores é obrigatório");
            expect(error.statusCode).toBe(400);
        }
    });
});