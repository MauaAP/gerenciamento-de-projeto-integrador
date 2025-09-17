import { Partner } from "app/shared/domain/entities/partner";
import { IPartnerRepository, PartnerUpdateOptions } from "app/shared/domain/interfaces/IPartnerRepository";
import { NotFoundException } from "app/shared/helpers/exceptions";

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