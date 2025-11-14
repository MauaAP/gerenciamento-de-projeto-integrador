import { describe, it, expect } from "vitest";
import { ROLE } from "../../../../app/shared/domain/enums/role";
import { BadRequestException } from "../../../../app/shared/helpers/exceptions";
import { RegisterUserRequest } from "../../../../app/modules/user/create_user/create_user_schema";
import { parseBody } from "../../../../app/shared/utils/parse_body";

describe("CreateUserUseCase - Zod validation", () => {
  it("should throw BadRequestException if name is missing", () => {
    const invalid = { email: "a@a.com", role: ROLE.STUDENT, password: "123456" };
    expect(() => parseBody(RegisterUserRequest, invalid)).toThrow(BadRequestException);
  });

  it("should throw BadRequestException if email is invalid", () => {
    const invalid = { name: "Test", email: "invalid", role: ROLE.STUDENT, password: "123456" };
    expect(() => parseBody(RegisterUserRequest, invalid)).toThrow(BadRequestException);
  });

  it("should throw BadRequestException if password is too short", () => {
    const invalid = { name: "Test", email: "a@a.com", role: ROLE.STUDENT, password: "123" };
    expect(() => parseBody(RegisterUserRequest, invalid)).toThrow(BadRequestException);
  });

  it("should throw BadRequestException if role is missing", () => {
    const invalid = { name: "Test", email: "a@a.com", password: "123456" };
    expect(() => parseBody(RegisterUserRequest, invalid)).toThrow(BadRequestException);
  });
});
