import { Presentation } from "app/shared/domain/entities/presentation";
import { IPresentationRepository } from "app/shared/domain/interfaces/IPresentationRepository";
import { NotFoundException } from "app/shared/helpers/exceptions";

export class DeletePresentationUseCase{
    constructor(private readonly presentationRepository: IPresentationRepository){}

    async execute(id: string): Promise<Presentation>{
        const deletedPresentation= await this.presentationRepository.deletePresentation(id)

        if(deletedPresentation === null)
            throw new NotFoundException("Apresentação não está no banco")

        return deletedPresentation
    }
}