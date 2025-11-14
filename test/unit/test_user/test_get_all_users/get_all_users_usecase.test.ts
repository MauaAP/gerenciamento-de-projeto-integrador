import { GetAllUsersUseCase } from "../../../../app/modules/user/get_all_users/get_all_users_usecase";
import { UserRepoMock } from "../../../../app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest"

describe("GetAllUsersUsecase", () => {
    let usecase: GetAllUsersUseCase
    let userRepo: UserRepoMock

    beforeEach(() => {
        userRepo = new UserRepoMock();
        usecase = new GetAllUsersUseCase(userRepo);
    })

    it("should return all users in repository mock", async () => {
        const result = await usecase.execute()

        expect(result.length).toBe(15);
        expect(result[0].userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result[0].name).toBe("Matuê")
        expect(result[0].email).toBe("matue@30praum.com.br")
        expect(result[0].role).toBe("ADMIN")
        expect(result[0].password).toBe("matue30")
    });
});