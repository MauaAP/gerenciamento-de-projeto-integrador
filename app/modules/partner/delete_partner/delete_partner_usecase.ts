import { Partner } from "app/shared/domain/entities/partner";
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";
import { NotFoundException } from "app/shared/helpers/exceptions";
export interface DeletePartnerDTO {
    id: string
}

export class DeletePartnerUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) {}

    async execute({id}: DeletePartnerDTO): Promise<Partner> {
        const existingPartner= await this.partnerRepository.getPartnerById(id)

        if (!existingPartner) {
            throw new NotFoundException("Parceiro não esta no banco")
        }

        const deletedPartner= await this.partnerRepository.deletePartnerById(id)

        if (deletedPartner === null) {
            throw new NotFoundException("Parceiro não esta no banco")
        }

        return deletedPartner
    }
}