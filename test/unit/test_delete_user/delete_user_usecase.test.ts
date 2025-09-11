import { DeleteUserUseCase } from "app/modules/user/delete_user/delete_user_usecase";
import { BadRequestException } from "app/shared/helpers/exceptions";
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
        const result= await usecase.execute({id: "7a181d51-4f96-4d97-81b9-16e08aa63742"})

        expect(result.userId).toBe("7a181d51-4f96-4d97-81b9-16e08aa63742")
        expect(result.name).toBe("Matuê")
        expect(result.email).toBe("matue@30praum.com.br")
        expect(result.role).toBe("ADMIN")
        expect(result.password).toBe("matue30")
    });

    it("should throw BadRequestException if id doesnt's exist", async () =>{
        await expect(usecase.execute({id: "7a181d51-4f96-4d97-81b9-16e08aa63776"})).rejects.toThrow(BadRequestException);
    });
});
