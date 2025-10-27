import { CreateGroupRequest } from "app/modules/group/create_group/create_group_schema";
import { COURSE } from "app/shared/domain/enums/course";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest";

describe("CreateGroupUseCase - Zod validation", () => {
    it("should throw BadRequestException if codSubj is missing", () => {
        try {
            parseBody(CreateGroupRequest, { userIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0cf"], yearSem: 20231, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Código da matéria é obrigatório")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if userIdList is missing", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", yearSem: 20231, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A lista de usuários é obrigatório")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if userIdList is empty", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: [], yearSem: 20231, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("A lista de usuários deve conter ao menos um id de usuário")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if userIdList has an id that is not a string", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: [123], yearSem: 20231, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O userId deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if userIdList has an id that is not 36 characters", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0c"], yearSem: 20231, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O userId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if yearSem is missing", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0cf"], projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O yearSem deve ser dadas em numero")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if yearSem is less than 1", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0cf"], yearSem: 0, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O yearSem deve ser maior que 0")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if projectId is missing", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0cf"], yearSem: 20231, course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("projectId é obrigatório")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if projectId is not 36 characters", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0cf"], yearSem: 20231, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0c", course: COURSE.CIC });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O projectId deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if course is missing", () => {
        try {
            parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0cf"], yearSem: 20231, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf" });
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("course é obrigatório")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should pass validation with all required fields", () => {
        const result = parseBody(CreateGroupRequest, { codSubj: "MAC0123", userIdList: ["470f1e7b-f645-4da6-9b59-2e7a9684b0cf"], yearSem: 20231, projectId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", course: COURSE.CIC });
        expect(result.codSubj).toBe("MAC0123");
        expect(result.userIdList).toEqual(["470f1e7b-f645-4da6-9b59-2e7a9684b0cf"]);
        expect(result.yearSem).toBe(20231);
        expect(result.projectId).toBe("470f1e7b-f645-4da6-9b59-2e7a9684b0cf");
        expect(result.course).toBe(COURSE.CIC);
    });
});