import { Partner } from "app/shared/domain/entities/partner";
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";
import { NotFoundException } from "app/shared/helpers/exceptions";

export interface GetPartnerDTO {
    id?: string,
    name?: string,
}

export class GetPartnerUseCase {
    constructor(private readonly PartnerRepository: IPartnerRepository) {}

    async execute ({id, name}: GetPartnerDTO): Promise<Partner> {
        const selectedPartner= id
        ? await this.PartnerRepository.getPartnerById(id)
        : await this.PartnerRepository.getPartnerByname(name!)

        if(selectedPartner === null){
            throw new NotFoundException("Parceiro não esta no banco")
        }

        return selectedPartner
    }
}