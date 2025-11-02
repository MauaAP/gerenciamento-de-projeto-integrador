import { DeletePresentationUseCase } from "app/modules/presentation/delete_presentation/delete_presentation_usecase";
import { PresentationRepoMock } from "app/shared/repositories/mocks/presentation_repository_mock";
import { describe, it, expect, beforeEach } from "vitest";

describe("DeletePresentationUsecase", () =>{
    let presentationRepo: PresentationRepoMock;
    let useCase: DeletePresentationUseCase;

    beforeEach(() => {
        presentationRepo = new PresentationRepoMock();
        useCase = new DeletePresentationUseCase(presentationRepo);
    });

    it("should delete the presentation from repository mock and return it", async () => {
        const result= await useCase.execute("8c77b6b9-a249-4318-a982-b07972bd1fb9")

        expect(result.presentationId).toBe("8c77b6b9-a249-4318-a982-b07972bd1fb9")
    });

    it("should throw NotFoundException if id doesn't exist", async () =>{
        try {
            await useCase.execute("470f1e7b-f645-4da6-9b59-2e7a9684b0c")
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Apresentação não está no banco")
            expect(error.statusCode).toBe(404)
        }
    });

});