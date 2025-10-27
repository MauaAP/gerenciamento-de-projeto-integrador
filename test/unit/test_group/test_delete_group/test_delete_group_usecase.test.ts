import { DeleteGroupUseCase } from "app/modules/group/delete_group/delete_group_usecase";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("DeleteGroupUsecase", () =>{
    let groupRepo: GroupRepoMock
    let useCase: DeleteGroupUseCase

    beforeEach(() =>{
        groupRepo= new GroupRepoMock();
        useCase= new DeleteGroupUseCase(groupRepo);
    });

    it("should delete the group from repository mock and return it", async () => {
        const result= await useCase.execute("14e97d3c-d309-43d4-bfa0-7724e1e54fb2")

        expect(result.groupId).toBe("14e97d3c-d309-43d4-bfa0-7724e1e54fb2")
        
    });

    it("should throw NotFoundException if id doesnt's exist", async () =>{
        try {
            await useCase.execute("470f1e7b-f645-4da6-9b59-2e7a9684b0c")
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Grupo não está no banco")
            expect(error.statusCode).toBe(404)
        }
    });
});