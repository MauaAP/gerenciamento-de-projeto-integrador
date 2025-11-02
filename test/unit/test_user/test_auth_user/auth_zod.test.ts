import { describe, it, expect } from "vitest";
import { AuthRequest } from "../../../../app/modules/user/auth/auth_schema";
import { parseBody } from "../../../../app/shared/utils/parse_body";
import { ZodError } from "zod";
import { BadRequestException } from "../../../../app/shared/helpers/exceptions";

describe("AuthUseCase - Zod validation", () => {
  it("should throw BadRequestException if email is missing", () => {
    const invalid = { password: "123456" };
    expect(() => parseBody(AuthRequest, invalid)).toThrow(BadRequestException);
  });

  it("should throw BadRequestException if email is invalid", () => {
    const invalid = { email: "invalid", password: "123456" };
    expect(() => parseBody(AuthRequest, invalid)).toThrow(BadRequestException);
  });

  it("should throw BadRequestException if password is missing", () => {
    const invalid = { email: "a@a.com" };
    expect(() => parseBody(AuthRequest, invalid)).toThrow(BadRequestException);
  });

  it("should throw BadRequestException if password is too short", () => {
    const invalid = { email: "a@a.com", password: "123" };
    expect(() => parseBody(AuthRequest, invalid)).toThrow(BadRequestException);
  });
});
