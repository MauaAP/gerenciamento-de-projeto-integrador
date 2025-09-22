import { DeleteUserRequest } from "../../../modules/user/delete_user/delete_user_schema";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { parseBody } from "../../../shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("DeleteUserSchema -Zod validation", () => {

    it("should pass the zod validation", () =>{
        expect(parseBody(DeleteUserRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa63742"})).toEqual({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742" });
    });

    it("should throw (id has less than 36 characters) if id has less than 36 characters", () =>{
        expect(() => parseBody(DeleteUserRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa637"})).toThrow("O id deve conter 36 caractéres");
    });
});