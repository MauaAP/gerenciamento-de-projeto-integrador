import { DeletePresentationRequest } from "app/modules/presentation/delete_presentation/delete_presentation_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("DeletePresentationSchema -Zod validation", () => {
    it("should pass the zod validation", () =>{
        expect(parseBody(DeletePresentationRequest, {id: "8c77b6b9-a249-4318-a982-b07972bd1fb9"})).toEqual({ id: "8c77b6b9-a249-4318-a982-b07972bd1fb9" });
    });

    it("should throw (id has less than 36 characters) if id has less than 36 characters", () =>{
        try {
            parseBody(DeletePresentationRequest, {id: "8c77b6b9-a249-4318-a982-b07972bd1fb"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (id deve ser dado em string) if id is not given in string", () =>{
        try {
            parseBody(DeletePresentationRequest, {id: 123456789012345678901234567890123456})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("o id deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });
});