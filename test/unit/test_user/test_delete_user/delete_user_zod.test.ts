import { DeleteUserRequest } from "../../../../app/modules/user/delete_user/delete_user_schema";
import { parseBody } from "../../../../app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("DeleteUserSchema -Zod validation", () => {

    it("should pass the zod validation", () =>{
        expect(parseBody(DeleteUserRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa63742"})).toEqual({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742" });
    });

    it("should throw (id has less than 36 characters) if id has less than 36 characters", () =>{
        try {
            parseBody(DeleteUserRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa637"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });
});