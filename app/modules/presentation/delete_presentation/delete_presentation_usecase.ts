import { Presentation } from "../../../shared/domain/entities/presentation";
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeletePresentationUseCase{
    constructor(private readonly presentationRepository: IPresentationRepository){}

    async execute(id: string): Promise<Presentation>{
        const deletedPresentation= await this.presentationRepository.deletePresentation(id)

        if(deletedPresentation === null)
            throw new NotFoundException("Apresentação não está no banco")

        return deletedPresentation
    }
}