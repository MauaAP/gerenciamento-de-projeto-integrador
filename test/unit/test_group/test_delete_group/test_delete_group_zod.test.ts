import { DeleteGroupRequest } from "app/modules/group/delete_group/delete_group_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("DeleteGroupSchema -Zod validation", () => {
    it("should pass the zod validation", () =>{
        expect(parseBody(DeleteGroupRequest, {id: "574478f6-a764-4c0e-a24a-febad942156f"})).toEqual({ id: "574478f6-a764-4c0e-a24a-febad942156f" });
    });

    it("should throw (id has less than 36 characters) if id has less than 36 characters", () =>{
        try {
            parseBody(DeleteGroupRequest, {id: "574478f6-a764-4c0e-a24a-febad942156"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });

    it("should throw (id deve ser dado em string) if id is not given in string", () =>{
        try {
            parseBody(DeleteGroupRequest, {id: 123456789012345678901234567890123456})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("o id deve ser dado em string")
            expect(error.statusCode).toBe(400)
        }
    });

});