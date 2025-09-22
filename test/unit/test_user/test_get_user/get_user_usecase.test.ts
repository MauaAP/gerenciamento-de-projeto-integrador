import { GetUserUseCase } from "../../../modules/user/get_user/get_user_usecase"
import { UserRepoMock } from "../../../shared/repositories/mocks/user_repository_mock"
import { describe, it, expect, beforeEach } from "vitest"

describe("GetUserUsecase", () => {
    let userRepo: UserRepoMock
    let usecase: GetUserUseCase

    beforeEach(() => {
        userRepo = new UserRepoMock();
        usecase = new GetUserUseCase(userRepo);
    })

    it("should get the user by id in repository mock and return it, also requester user is an admin", async () => {
        const result = await usecase.execute({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742", isAdmin: true })

        expect(result.userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result.name).toBe("Matuê")
        expect(result.email).toBe("matue@30praum.com.br")
        expect(result.role).toBe("ADMIN")
        expect(result.password).toBe("matue30")
    });

    it("should get the user by email in repository mock and return it, also requester user is an admin", async () => {
        const result = await usecase.execute({ email: "matue@30praum.com.br", isAdmin: true })

        expect(result.userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result.name).toBe("Matuê")
        expect(result.email).toBe("matue@30praum.com.br")
        expect(result.role).toBe("ADMIN")
        expect(result.password).toBe("matue30")
    });

    it("should get the user by id in repository mock and return it, also requester user is a moderator", async () => {
        const result = await usecase.execute({ id: "e9c7d747-9e8e-4d34-935e-473c2c16be83", isAdmin: false })

        expect(result.userId).toBe("e9c7d747-9e8e-4d34-935e-473c2c16be83")
        expect(result.name).toBe("Zinedine Zidane")
        expect(result.email).toBe("zidane@realmadrid.com.es")
        expect(result.role).toBe("MODERATOR")
        expect(result.password).toBe("#Cabecada2006")
    });

    it("should throw (Você não tem permissão para vizualizar um admin) if requester user is a moderator and is trying to get an admin", async () => {
        await expect(usecase.execute({ id: "7a181d51-4f96-4d97-81b9-16e08aa63742", isAdmin: false })).rejects.toThrow("Você não tem permissão para vizualizar um admin");
    });

    it("should throw (Usuario nao esta no banco) if id doesn't exist", async () => {
        await expect(usecase.execute({ id: "7a181d51-4f96-4d97-81b9-16e08aa63776", isAdmin: true })).rejects.toThrow("Usuario nao esta no banco");
    });

    it("should throw (Usuario nao esta no banco) if email doesn't exist", async () => {
        await expect(usecase.execute({ email: "thor@gmail.com", isAdmin: true })).rejects.toThrow("Usuario nao esta no banco");
    });

});