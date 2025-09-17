import { DeleteUserUseCase } from "app/modules/user/delete_user/delete_user_usecase";
import {ForbiddenException, NotFoundException } from "app/shared/helpers/exceptions";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("DeleteUserUsecase", () =>{
    let userRepo: UserRepoMock
    let usecase: DeleteUserUseCase

    beforeEach(() =>{
        userRepo= new UserRepoMock();
        usecase= new DeleteUserUseCase(userRepo);
    })

    it("should delete the user from repository mock and return it", async () => {
        const result= await usecase.execute({id: "7a181d51-4f96-4d97-81b9-16e08aa63742", isAdmin: true})

        expect(result.userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result.name).toBe("Matuê")
        expect(result.email).toBe("matue@30praum.com.br")
        expect(result.role).toBe("ADMIN")
        expect(result.password).toBe("matue30")
    });

    it("should throw NotFoundException if id doesnt's exist", async () =>{
        await expect(usecase.execute({id: "7a181d51-4f96-4d97-81b9-16e08aa63776", isAdmin: true})).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if trying to delete an admin without being an admin", async () =>{
        await expect(usecase.execute({id: "7a181d51-4f96-4d97-81b9-16e08aa63742", isAdmin: false})).rejects.toThrow(ForbiddenException);
    });
});
