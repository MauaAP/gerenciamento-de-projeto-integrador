import { Partner } from "../../../shared/domain/entities/partner";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";
export interface DeletePartnerDTO {
    id: string
}

export class DeletePartnerUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) {}

    async execute({id}: DeletePartnerDTO): Promise<Partner> {
        const deletedPartner= await this.partnerRepository.deletePartnerById(id)

        if (deletedPartner === null) {
            throw new NotFoundException("Parceiro não está no banco")
        }

        return deletedPartner
    }
}