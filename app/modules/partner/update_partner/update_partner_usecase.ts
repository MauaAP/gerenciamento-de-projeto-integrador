import { Partner } from "../../../shared/domain/entities/partner";
import { IPartnerRepository, PartnerUpdateOptions } from "../../../shared/domain/interfaces/IPartnerRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export interface UpdatePartnerDTO {
    id: string;
    updateOptions: PartnerUpdateOptions
}
export class UpdatePartnerUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository){}

    async execute({id, updateOptions}: UpdatePartnerDTO): Promise<Partner> {
        const updatePartner= await this.partnerRepository.updatePartner(id, updateOptions)

        if (updatePartner === null){
            throw new NotFoundException("Usuário não esta no banco")
        }

        return updatePartner
    }
}