import { Partner } from "../../../shared/domain/entities/partner";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

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
            throw new NotFoundException("Parceiro não está no banco")
        }

        return selectedPartner
    }
}