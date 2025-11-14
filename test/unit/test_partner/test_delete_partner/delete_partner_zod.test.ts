import { DeletePartnerRequest } from "app/modules/partner/delete_partner/delete_partner_schema";
import { parseBody } from "app/shared/utils/parse_body";
import { describe, expect, it } from "vitest";

describe("DeletePartnerSchema -Zod validation", () => {
    it("should pass the zod validation", () =>{
        expect(parseBody(DeletePartnerRequest, {id: "574478f6-a764-4c0e-a24a-febad942156f"})).toEqual({ id: "574478f6-a764-4c0e-a24a-febad942156f" });
    });

    it("should throw (id has less than 36 characters) if id has less than 36 characters", () =>{
        try {
            parseBody(DeletePartnerRequest, {id: "574478f6-a764-4c0e-a24a-febad942156"})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("BadRequestException");
            expect(error.message).toBe("O id deve conter 36 caracteres")
            expect(error.statusCode).toBe(400)
        }
    });
});