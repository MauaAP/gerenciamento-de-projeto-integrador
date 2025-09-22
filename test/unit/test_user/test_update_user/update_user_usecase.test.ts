import { UpdateUserUseCase } from "../../../modules/user/update_user/update_user_usecase"
import { NotFoundException } from "../../../shared/helpers/exceptions"
import { UserRepoMock } from "../../../shared/repositories/mocks/user_repository_mock"
import { describe, it, expect, beforeEach } from "vitest"

describe("UpdateUserUsecase", () => {
    let userRepo: UserRepoMock
    let usecase: UpdateUserUseCase

    beforeEach(() => {
        userRepo = new UserRepoMock();
        usecase = new UpdateUserUseCase(userRepo);
    })

    it("should update the user in repository mock and return it", async () => {
        const result = await usecase.execute({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742", updateOptions: { name: "Matuê2", email: "matue@30.com.br", password: "matue302" } })

        expect(result.userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result.name).toBe("Matuê2")
        expect(result.email).toBe("matue@30.com.br")
        expect(result.role).toBe("ADMIN")
        expect(result.password).toBe(result.password)
    });

    it("should throw NotFoundException if id doesn't exist", async () => {
        await expect(usecase.execute({ id: "7a181d51-4f96-4d97-81b9-16e08aa63776", updateOptions: { name: "Matuê2" }})).rejects.toThrow(NotFoundException);
    });
})