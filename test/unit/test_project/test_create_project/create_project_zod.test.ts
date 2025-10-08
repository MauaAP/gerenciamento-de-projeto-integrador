import { CreateProjectRequest } from "app/modules/project/create_project/create_project_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, it, expect } from "vitest";

describe("CreatePartnerUseCase - Zod validation", () => {
    it("should throw BadRequestException if title is missing", () => {
        try {
            parseBody(CreateProjectRequest, {partnerId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", extensionHours: 10});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Título é obrigatório")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if title is less than 6 characters", () => {
        try {
            parseBody(CreateProjectRequest, {title: "Projeto Teste", partnerId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", extensionHours: 10});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O título deve conter pelo menos 6 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if partnerId is missing", () => {
        try {
            parseBody(CreateProjectRequest, {title: "Projeto Teste", extensionHours: 10});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("Id do parceiro é obrigatório")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if partnerId is not 36 characters", () => {
        try {
            parseBody(CreateProjectRequest, {title: "Projeto Teste", partnerId: "470f1e7b-f645-4da6-9b59-2e7a9684b0c", extensionHours: 10});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id do parceiro conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if extensionHours is not a number", () => {
        try {
            parseBody(CreateProjectRequest, {title: "Projeto Teste", partnerId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", extensionHours: "10"});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("As horas de extensão devem ser dadas em numero de horas (number)")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw BadRequestException if extensionHours is less than 1", () => {
        try {
            parseBody(CreateProjectRequest, {title: "Projeto Teste", partnerId: "470f1e7b-f645-4da6-9b59-2e7a9684b0cf", extensionHours: -5});
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O numero de horas de extensão deve ser maior que 0")
            expect(error.statusCode).toBe(400)
        }
    });
});