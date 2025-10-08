import { describe, it, expect, beforeEach } from "vitest";
import { AuthUseCase } from "../../../../app/modules/user/auth/auth_usecase";
import { UserRepoMock } from "../../../../app/shared/repositories/mocks/user_repository_mock";
import { UserBuilder } from "../../factories/user.factory";
import { Encrypt } from "../../../../app/shared/helpers/encrpyt";
import { BadRequestException, ForbiddenException } from "../../../../app/shared/helpers/exceptions";
import { ROLE } from "../../../../app/shared/domain/enums/role";


describe("AuthUseCase", () => {
  let userRepo: UserRepoMock;
  let usecase: AuthUseCase;
  let password: string;

  beforeEach(async () => {
    userRepo = new UserRepoMock();
    usecase = new AuthUseCase(userRepo);
    password = "SenhaSegura123";
    const hashed = await Encrypt.hashPassword(password);
    userRepo.createUser(
      new UserBuilder()
        .email("loginuser@example.com")
        .password(hashed)
        .role(ROLE.STUDENT)
        .build()
    );
  });

  it("should authenticate and return token and user", async () => {
    const result = await usecase.execute({
      email: "loginuser@example.com",
      password,
    });
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("loginuser@example.com");
  });

  it("should throw BadRequestException if user does not exist", async () => {
    await expect(
      usecase.execute({ email: "notfound@example.com", password: "123456" })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw ForbiddenException if password is invalid", async () => {
    await expect(
      usecase.execute({ email: "loginuser@example.com", password: "wrongpass" })
    ).rejects.toThrow(ForbiddenException);
  });
});
