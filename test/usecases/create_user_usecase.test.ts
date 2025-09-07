import { describe, it, expect, beforeEach } from "vitest";
import { CreateUserUseCase } from "../../app/modules/user/create_user/create_user_usecase";
import { UserRepoMock } from "../../app/shared/repositories/mocks/user_repository_mock";
import { RequestCreateUserBuilder } from "../factories/user.factory";
import { ROLE } from "../../app/shared/domain/enums/role";
import { BadRequestException } from "../../app/shared/helpers/exceptions";


describe("CreateUserUseCase", () => {
  let userRepo: UserRepoMock;
  let usecase: CreateUserUseCase;

  beforeEach(() => {
    userRepo = new UserRepoMock();
    usecase = new CreateUserUseCase(userRepo);
  });

  it("should create a new user and return user and token", async () => {
    const request = new RequestCreateUserBuilder()
      .email("newuser@example.com")
      .role(ROLE.STUDENT)
      .build();

    const result = await usecase.execute(request);
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("newuser@example.com");
  });

  it("should throw BadRequestException if email already exists", async () => {
    const request = new RequestCreateUserBuilder()
      .email("matue@30praum.com.br")
      .role(ROLE.ADMIN)
      .build();

    await expect(usecase.execute(request)).rejects.toThrow(BadRequestException);
  });
});
