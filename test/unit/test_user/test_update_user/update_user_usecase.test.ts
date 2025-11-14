import { UpdateUserUseCase } from "../../../../app/modules/user/update_user/update_user_usecase"
import { NotFoundException } from "../../../../app/shared/helpers/exceptions"
import { UserRepoMock } from "../../../../app/shared/repositories/mocks/user_repository_mock"
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

    it("should update only the name of the user in repository mock and return it", async () => {
        const result = await usecase.execute({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742", updateOptions: { name: "Matuê2"}})

        expect(result.userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result.name).toBe("Matuê2")
        expect(result.email).toBe("matue@30praum.com.br")
        expect(result.role).toBe("ADMIN")
        expect(result.password).toBe(result.password)
    });

    it("should update only the email of the user in repository mock and return it", async () => {
        const result = await usecase.execute({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742", updateOptions: { email: "matue@30.com.br"}})

        expect(result.userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result.name).toBe("Matuê")
        expect(result.email).toBe("matue@30.com.br")
        expect(result.role).toBe("ADMIN")
        expect(result.password).toBe(result.password)
    });

    it("should update only the password of the user in repository mock and return it", async () => {
        const result = await usecase.execute({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742", updateOptions: { password: "matue302"}})

        expect(result.userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result.name).toBe("Matuê")
        expect(result.email).toBe("matue@30praum.com.br")
        expect(result.role).toBe("ADMIN")
        expect(result.password).toBe(result.password)
    });

    it("should throw NotFoundException if id doesn't exist", async () => {
        try {
            await expect({ id: "7a181d51-4f96-4d97-81b9-16e08aa63776", updateOptions: { name: "Matuê2" }})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Usuário não está no banco")
        }
    });
})