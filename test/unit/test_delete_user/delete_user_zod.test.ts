import { parseBody } from "app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";
import { RegisterDeleteUserRequest} from "../../../app//modules/user/delete_user/delete_user_schema"
import { assert } from "console";
import { BadRequestException } from "../../../app/shared/helpers/exceptions";
import { rejects } from "assert";

describe("DeleteUserSchema -Zod validation", () => {

    it("should pass the zod validation", () =>{
        expect(parseBody(RegisterDeleteUserRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa63742"})).toEqual({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742" });
    });

    it("should throw BadRequestException if id has less than 36 characters", () =>{
        expect(() => parseBody(RegisterDeleteUserRequest, {id: "7a181d51-4f96-4d97-81b9-16e08aa637"})).toThrow(BadRequestException);
    });
});